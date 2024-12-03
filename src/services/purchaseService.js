import db from "../models/index";
const Sequelize = db.Sequelize;

function getCondition(searchType, query) {
  let OrCondition = [];

  if (searchType == "id" || searchType == "all") {
    OrCondition.push({
      receipt_id: {
        [Sequelize.Op.substring]: query,
      },
    });
  }

  return { OrCondition };
}

const getPage = async (
  page,
  limit,
  query,
  searchBy,
  orderBy,
  orderType,
  startDate,
  endDate,
  startTotal,
  endTotal,
  provider_id
) => {
  let { OrCondition } = getCondition(searchBy, query);

  // Đặt điều kiện createdAt dựa trên startDate và endDate
  let createdAt = {};
  if (startDate && endDate) {
    createdAt = {
      [Sequelize.Op.between]: [startDate, endDate],
    };
  } else if (startDate) {
    createdAt = {
      [Sequelize.Op.gte]: startDate,
    };
  } else if (endDate) {
    createdAt = {
      [Sequelize.Op.lte]: endDate,
    };
  } else {
    createdAt = undefined; // Không đặt điều kiện nếu cả startDate và endDate đều rỗng
  }

  let total = {};
  if (startTotal && endTotal) {
    total = {
      [Sequelize.Op.between]: [startTotal, endTotal],
    };
  }
  if (startTotal && !endTotal) {
    total = {
      [Sequelize.Op.gte]: startTotal,
    };
  }
  if (!startTotal && endTotal) {
    total = {
      [Sequelize.Op.lte]: endTotal,
    };
  }

  let where = {
    [Sequelize.Op.and]: [
      {
        [Sequelize.Op.or]: OrCondition,
      },
      ...(createdAt ? [{ createdAt }] : []), // Thêm điều kiện createdAt nếu có
      ...(total ? [{ total }] : []), // Thêm điều kiện total nếu có
      ...(provider_id ? [{ provider_id }] : []), // Thêm điều kiện provider_id nếu có
    ],
  };

  return new Promise(async (resolve, reject) => {
    try {
      let receipts = await db.goodsreceipt.findAll({
        include: [
          {
            model: db.providers,
            as: "provider",
            attributes: ["name"],
          },
        ],
        limit: limit,
        offset: (page - 1) * limit,
        order: [[orderBy, orderType]],
        where,
      });

      let total_receipt = await db.goodsreceipt.count({
        where,
      });

      let total_page = Math.ceil(total_receipt / limit);
      resolve({ receipts, total_page, page });
    } catch (error) {
      reject(error);
    }
  });
};

const getReceiptById = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let receipt = await db.goodsreceipt.findOne({
        where: { receipt_id: id },
        include: [
          {
            model: db.batches,
            as: "batches",
            include: [
              {
                model: db.books,
                as: "book",
                attributes: ["book_id", "title"],
              },
            ],
            attributes: ["price"],
            through: { attributes: ["quantity"], as: "detail" },
          },
          {
            model: db.providers,
            as: "provider",
            attributes: ["name"],
          },
        ],
      });
      if (!receipt) {
        throw new Error("Receipt not found");
      }
      resolve(receipt);
    } catch (error) {
      reject(error);
    }
  });
};

const getReceiptDetail = async (id) => {
  //k xai
  return new Promise(async (resolve, reject) => {
    try {
      let receiptDetail = await db.goodsreceiptdetails.findAll({
        where: { receipt_id: id },
      });
      if (!receiptDetail) {
        throw new Error("Receipt detail not found");
      }
      resolve(receiptDetail);
    } catch (error) {
      reject(error);
    }
  });
};

const createReceipt = async ({ total, provider_id, details }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newReceipt = await db.goodsreceipt.create({ total, provider_id });
      let batches = await db.batches.bulkCreate(details);
      batches.forEach(async (batch) => {
        await newReceipt.addBatch(batch, {
          through: { quantity: batch.stock_quantity, price: batch.price },
        });
      });
      resolve(newReceipt);
    } catch (error) {
      console.log("service error: ", error.message);
      reject(error);
    }
  });
};

const createReceiptDetail = async (receiptDetail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newReceiptDetail = await db.goodsreceiptdetails.create(receiptDetail);
      resolve(newReceiptDetail);
    } catch (error) {
      reject(error);
    }
  });
};

const hideReceipt = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let receipt = await db.goodsreceipt.findOne({
        where: { receipt_id: id },
      });
      if (!receipt) {
        throw new Error("Receipt not found");
      }
      await db.goodsreceipt.update(
        { status: 0 },
        { where: { receipt_id: id } }
      );
      resolve(receipt);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getPage,
  getReceiptById,
  getReceiptDetail,
  createReceipt,
  createReceiptDetail,
  hideReceipt,
};
