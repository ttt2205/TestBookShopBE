import db from "../models";
import { Op } from "sequelize";

const getPage = async (page, limit, query, searchType, sortBy) => {
  try {
    let promotions = [];
    let total_page = 0;
    if (searchType === "all") {
      promotions = await db.billpromotions.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { billPromotion_id: { [Op.like]: `%${query}%` } },
          ],
          status: 1,
        },
        order: [[sortBy, "ASC"]], // Sắp xếp theo cột được truyền vào
        offset: (page - 1) * limit, // Bỏ qua các bản ghi
        limit: limit, // Số lượng bản ghi trả về
      });
      total_page = Math.ceil(
        (await db.billpromotions.count({
          where: {
            [Op.or]: [
              { name: { [Op.like]: `%${query}%` } },
              { billPromotion_id: { [Op.like]: `%${query}%` } },
            ],
            status: 1,
          },
        })) / limit
      );
    } else {
      promotions = await db.billpromotions.findAll({
        where: {
          name: {
            [Op.like]: `%${query}%`, // `%` là ký tự đại diện trong SQL
          },
          status: 1,
        },
        order: [[sortBy, "ASC"]], // Sắp xếp theo cột được truyền vào
        offset: (page - 1) * limit, // Bỏ qua các bản ghi
        limit: limit, // Số lượng bản ghi trả về
      });
      total_page = Math.ceil(
        (await db.billpromotions.count({
          where: {
            name: {
              [Op.like]: `%${query}%`, // Tìm kiếm giống `$regex` trong MongoDB
            },
            status: 1,
          },
        })) / limit
      );
    }
    return { promotions, total_page };
  } catch (error) {
    throw new Error(error);
  }
};

const create = async (promotion) => {
  try {
    await db.billpromotions.create(promotion);
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (billPromotion_id, promotion) => {
  try {
    await db.billpromotions.update(promotion, {
      where: {
        billPromotion_id,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getPage,
  create,
  update,
};
