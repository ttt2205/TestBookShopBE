const { where } = require("sequelize");
const db = require("../models");

const getOrdersService = async () => {
    try {
        const orders = await db.orders.findAll({
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
                            as: "books",
                            attributes: ["title"],
                        }
                    ],
                    through: {
                        attributes: ["quantity", "final_price"], // Chỉ lấy final_price từ bảng trung gian
                    },
                },
            ],
        });
        if (!orders) {
            return { error: 4, message: "Orders is not found", orders: [] };
        }
        return { error: 0, message: "Get data orders succeed", orders: orders }; // Trả về orders
    } catch (error) {
        console.error(">>> Service getOrdersService ", error.message, error.stack);
        return { error: 3, message: "Connect data is not successful", orders: [] };
    }
}

// Thực hiện confirm order
const updateStatusOrderService = async (orderId) => {
    try {
        const result = await db.orders.update(
            { status_id: 2 }, // Giá trị cần cập nhật
            { where: { order_id: orderId } } // Điều kiện lọc
        );
        if (!result[0]) {
            return { error: 4, message: "Order by id is not found" };
        }
        return { error: 0, message: "Update status order succeed" };
    } catch (error) {
        console.error(">>> Service updateStatusOrderService ", error.message, error.stack);
        return { error: 3, message: "Connect data is not successful" };
    }
}

const updateStatusCancelOrderService = async (orderId) => {
    try {
        const result = await db.orders.update(
            { status_id: 5 }, // Giá trị cần cập nhật
            { where: { order_id: orderId } } // Điều kiện lọc
        );
        if (!result[0]) {
            return { error: 4, message: "Order by id is not found" };
        }
        // Thực hiện cập nhật các batches
        let orderDetails = await db.orderdetails.findAll({
            where: { order_id: orderId }
        });
        // convert sequelize to object
        orderDetails = orderDetails.map((item) => item.toJSON());
        if (orderDetails.length === 0) {
            console.log('No order details found for orderId:', orderId);
        } else {
            console.log(orderDetails);
        }

        orderDetails.forEach(async (item) => {
            const transaction = await db.sequelize.transaction();
            const existingBatch = await db.batches.findOne({
                where: { batch_id: item.batch_id },
                transaction: transaction
            })
            if (existingBatch) {
                existingBatch.stock_quantity += item.quantity; // Add totalQuantity to the current quantity
                // Save the updated batch instance
                await existingBatch.save({ transaction });
                // Commit the transaction after all operations are done
                await transaction.commit();
                console.log('Batch updated with new total quantity:', existingBatch.stock_quantity);
            } else {
                // If no batch exists (unlikely if you're using `findOne` with the same ID)
                console.log('Batch not found.');
            }
        })
        return { error: 0, message: "Cancel order succeed" };
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        console.error(">>> Service updateStatusCancelOrderService ", error.message, error.stack);
        return { error: 3, message: "Connect data is not successful" };
    }
}

const updateStatusReceivedOrderService = async (orderId) => {
    try {
        const result = await db.orders.update(
            { status_id: 4 }, // Giá trị cần cập nhật
            { where: { order_id: orderId } } // Điều kiện lọc
        );
        if (!result[0]) {
            return { error: 4, message: "Order by id is not found" };
        }
        return { error: 0, message: "Update status order succeed" };
    } catch (error) {
        console.error(">>> Service updateStatusReceivedOrderService ", error.message, error.stack);
        return { error: 3, message: "Connect data is not successful" };
    }
}

module.exports = {
    getOrdersService,
    updateStatusOrderService,
    updateStatusCancelOrderService,
    updateStatusReceivedOrderService
}