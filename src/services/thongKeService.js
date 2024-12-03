import db from "../models/index";

const getReceipts = (fromDate, toDate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const receipts = await db.goodsreceipt.findAll({
        include: [
          {
            model: db.books,
            as: "details",
            attributes: ["book_id", "title"],
            through: { attributes: ["quantity", "price"], as: "detail" },
          },
          {
            model: db.providers,
            as: "provider",
            attributes: ["name"],
          },
        ],
        where: {
          createdAt: {
            $gte: fromDate,
            $lte: toDate,
          },
        },
      });
      resolve(receipts);
    } catch (error) {
      reject(error);
    }
  });
};

//lay thong ke luong truy cap
const getAccessLogs = (fromDate, toDate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const logs = await db.Log.findAll({
        where: {
          createdAt: {
            [db.Sequelize.Op.gte]: fromDate,
            [db.Sequelize.Op.lte]: toDate,
          },
        },
      });
      //dem theo tung ngay
      let result = new Map();
      logs.forEach((log) => {
        let date = log.createdAt.toISOString().split("T")[0];
        if (result.has(date)) {
          let count = result.get(date);
          result.set(date, count + 1);
        } else {
          result.set(date, 1);
        }
      });
      result = Array.from(result).map(([date, count]) => ({ date, count }));

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const getRevenueAndProfit = (fromDate, toDate) => {
  return new Promise(async (resolve, reject) => {
    try {
      //dung raw query de lay du lieu
      const result = await db.sequelize.query(
        `SELECT DATE(temp.createdAt) AS 'date',
              SUM(revenue) AS revenue,
              SUM(profit) AS profit
        FROM
          (SELECT o.order_id,
                  o.createdAt,
                  total_amount AS revenue,
                  (total_amount - capital) AS profit
          FROM orders o,

            (SELECT order_id,
                    SUM(b.price * d.quantity) AS capital
              FROM batches b,
                  orderdetails d
              WHERE b.batch_id = d.batch_id
              GROUP BY order_id) AS TEMP
          WHERE o.order_id = temp.order_id) TEMP
        WHERE DATE(temp.createdAt) >= '${fromDate}' AND DATE(temp.createdAt) < '${toDate}'
        GROUP BY DATE(temp.createdAt)`,
        {
          type: db.sequelize.QueryTypes.SELECT,
        }
      );
      let data = result.map((item) => {
        return {
          date: item.date,
          revenue: parseInt(item.revenue),
          profit: parseInt(item.profit),
        };
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

const getSaleTrending = (fromDate, toDate) => {
  return new Promise(async (resolve, reject) => {
    const fakeResponse = [
      {
        book_id: 1,
        book_name: "Sách 1hhaskdhaskdhakshdkadasdasd",
        quantity: 10,
      },
      { book_id: 2, book_name: "Sách 2kjhakjdhakshdajhdkjahsdk", quantity: 20 },
      { book_id: 3, book_name: "Sách 3asjhdjahsdahdjhakdjahkdj", quantity: 30 },
      { book_id: 4, book_name: "Sách 4 sdfsdfasfaf safasf as f", quantity: 20 },
      { book_id: 5, book_name: "Sách 5 sfdfaf asfas fa f", quantity: 40 },
      { book_id: 6, book_name: "Sách 6 fsdfa asf afadfas fas", quantity: 50 },
      { book_id: 7, book_name: "Sách 7 awsfasfaf", quantity: 60 },
      { book_id: 8, book_name: "Sách 8", quantity: 10 },
      { book_id: 9, book_name: "Sách 9", quantity: 6 },
      { book_id: 10, book_name: "Sách 10", quantity: 12 },
    ];
    try {
      // const result = fakeResponse
      //   .map((item) => ({
      //     ...item,
      //     quantity: Math.floor(Math.random() * 100),
      //   }))
      //   .sort((a, b) => b.quantity - a.quantity);
      // resolve(result);

      //raw query
      const result = await db.sequelize.query(
        `SELECT b.book_id, p.title AS book_name, SUM(d.quantity) AS quantity
        FROM orders o 
        JOIN orderdetails d ON o.order_id = d.order_id
        JOIN batches b ON d.batch_id = b.batch_id
        JOIN books p ON b.book_id = p.book_id
        WHERE DATE(o.createdAt) >= '${fromDate}' AND DATE(o.createdAt) <= '${toDate}'
        GROUP BY b.book_id
        ORDER BY quantity DESC`,
        {
          type: db.sequelize.QueryTypes.SELECT,
        }
      );
      let data = result.map((item) => {
        return {
          book_id: item.book_id,
          book_name: item.book_name,
          quantity: parseInt(item.quantity),
        };
      });
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
export default {
  getReceipts,
  getAccessLogs,
  getRevenueAndProfit,
  getSaleTrending,
};
