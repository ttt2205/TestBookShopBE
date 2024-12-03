import db from "../models";
import bookService from "./bookService";

const createOrder = (customer_id, orderDetails, address) => {
  return new Promise(async (resolve, reject) => {
    let t = await db.sequelize.transaction();
    try {
      let order = await db.orders.create(
        {
          customer_id: customer_id,
          address: address,
          status_id: 1,
        },
        { transaction: t }
      );
      //create details
      let total = 0;
      let details = [];
      for (let i = 0; i < orderDetails.length; i++) {
        let item = orderDetails[i];
        let book = await getBook(item.book_id, item.discount_id);
        if (!book) {
          throw new Error("Book not found or discount not available");
        }
        let discount = book.discounts[0];
        let final_cost = parseInt(
          item.quantity * book.sale_price * (1 - discount.percent_value / 100)
        );
        total += final_cost;
        while (item.quantity > 0) {
          console.log("item", item);
          let minBatch = await getMinBatch(item.book_id);
          let quantity = Math.min(item.quantity, minBatch.stock_quantity);
          if (quantity === 0) {
            throw new Error("Not enough stock");
          }
          let detail = await db.orderdetails.create(
            {
              order_id: order.order_id,
              batch_id: minBatch.batch_id,
              quantity: quantity,
              final_price: parseInt(
                book.sale_price * (1 - discount.percent_value / 100)
              ),
            },
            { transaction: t }
          );
          details.push(detail);
          //update batch
          minBatch.stock_quantity -= quantity;
          await minBatch.save({ transaction: t });
          item.quantity -= quantity;
        }
      }
      order.total_amount = total;
      await order.save({ transaction: t });
      await t.commit();
      resolve(order);
    } catch (error) {
      console.log("rolled back");
      await t.rollback();
      reject(error);
    }
    reject("Unknown error");
  });
};

const getMinBatch = (book_id) => {
  return db.batches.findOne({
    where: {
      book_id: book_id,
      stock_quantity: {
        [db.Sequelize.Op.gt]: 0,
      },
    },
    order: [["stock_quantity", "ASC"]],
  });
};

const getBook = (book_id, discount_id) => {
  return db.books.findOne({
    include: [
      {
        model: db.discounts,
        as: "discounts",
        through: { attributes: [] },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        where: {
          discount_id: parseInt(discount_id),
          end_at: {
            [db.Sequelize.Op.gte]: new Date(),
          },
          start_at: {
            [db.Sequelize.Op.lte]: new Date(),
          },
          status: 1,
        },
      },
    ],
    where: {
      book_id: book_id,
    },
  });
};

const getOrderByEmailService = async (email) => {
  const transaction = await db.sequelize.transaction(); // Khởi tạo transaction
  try {
    // Tìm khách hàng trong cơ sở dữ liệu
    const customer = await db.customers.findOne({
      where: { email: email },
      transaction: transaction, // Gắn transaction vào query
      attributes: ["customer_id"],
      include: [
        {
          model: db.orders,
          as: "orders",
          include: [
            {
              model: db.orderstatus,
              as: "orderstatus",
              attributes: ["status_name"],
            },
            {
              model: db.batches,
              as: "batches",
              attributes: ["book_id"],
              include: [
                {
                  model: db.books,
                  as: "book",
                  attributes: ["title"],
                },
              ],
              through: {
                attributes: ["quantity", "final_price"], // Chỉ lấy final_price từ bảng trung gian
              },
            },
          ],
        },
      ],
    });

    // Kiểm tra nếu khách hàng không tồn tại
    if (!customer) {
      await transaction.rollback(); // Hủy transaction
      return { error: 4, message: "Customer is not found" };
    }
    // Commit transaction sau khi thành công
    await transaction.commit();
    return {
      error: 0,
      message: "Customer information updated successfully",
      customer: customer,
    };
  } catch (error) {
    // Rollback nếu có lỗi
    await transaction.rollback();
    console.error(
      ">>> Service updateCustomerInfoService Error:",
      error.message,
      "\nStack:",
      error.stack
    );
    return { error: 3, message: "Data connection failed" };
  }
};

module.exports = {
  createOrder: createOrder,
  getMinBatch,
  getBook,
  getOrderByEmailService,
};
