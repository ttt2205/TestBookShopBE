import { where } from "sequelize";
import db from "../models";
const Promotion = db.billpromotions;
const Discount = db.discounts;
const Genre = db.genres;

const handleGetAllPromotion = async (req, res) => {
  try {
    let promotions = await Promotion.findAll({
      where: {
        status: 1,
      },
    });
    return res.status(200).json({
      message: "Success",
      promotions: promotions || [],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleGetPromotionById = async (req, res) => {
  const id = req.params.id;
  try {
    let promotion = await Promotion.findByPk(id);
    return res.status(200).json({
      message: "Success",
      promotion: promotion,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleCreatePromotion = async (req, res) => {
  const promotion = req.body;
  try {
    await Promotion.create(promotion);
    return res.status(200).json({
      message: "Create promotion successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleUpdatePromotion = async (req, res) => {
  const promotion_id = req.params.id;
  const promotion = req.body;
  try {
    await Promotion.update(promotion, {
      where: {
        billPromotion_id: promotion_id,
      },
    });
    return res.status(200).json({
      message: "Update promotion successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleGetAllDiscount = async (req, res) => {
  try {
    let discounts = await Discount.findAll({
      where: {
        status: 1,
      },
    });
    return res.status(200).json({
      message: "Success",
      discounts: discounts || [],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleGetDiscountById = async (req, res) => {
  const id = req.params.id;
  try {
    let discount = await Discount.findByPk(id);
    return res.status(200).json({
      message: "Success",
      discount: discount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleCreateDiscount = async (req, res) => {
  const discount = req.body;
  try {
    await Discount.create(discount);
    return res.status(200).json({
      message: "Create discount successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleUpdateDiscount = async (req, res) => {
  const discount_id = req.params.id;
  const discount = req.body;
  try {
    await Discount.update(discount, {
      where: {
        discount_id: discount_id,
      },
    });
    return res.status(200).json({
      message: "Update discount successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleGetAllGenres = async (req, res) => {
  try {
    let genres = await Genre.findAll();
    return res.status(200).json({
      message: "Success",
      genres: genres || [],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const handleApplyDiscount = async (req, res) => {
  const discount_id = req.params.id;
  const genres = req.body.genres;
  try {
    let discount = await Discount.findByPk(discount_id);
    if (!discount) {
      return res.status(404).json({
        message: "Discount not found",
      });
    }
    if (db.bookdiscount && db.books) {
      let books = await db.books.findAll({
        where: {
          genre_id: genres,
        },
      });
      for (let book of books) {
        await db.bookdiscount.findOrCreate({
          where: {
            book_id: book.book_id,
            discount_id: discount_id,
          },
          defaults: {
            book_id: book.book_id,
            discount_id: discount_id,
          },
        });
      }
    } else {
      throw new Error("db.bookdiscount or db.books not found");
    }
    return res.status(200).json({
      message: "Apply discount successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default {
  handleGetAllPromotion,
  handleGetPromotionById,
  handleCreatePromotion,
  handleUpdatePromotion,
  handleGetAllDiscount,
  handleGetDiscountById,
  handleCreateDiscount,
  handleUpdateDiscount,
  handleGetAllGenres,
  handleApplyDiscount,
};
