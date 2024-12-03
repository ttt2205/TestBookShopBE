import db from "../models";
const fs = require("fs");

const baseUrl = `http://${process.env.HOSTNAME}/img/`;

const createImage = async ({ url, book_id, is_main }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newImage = await db.bookimages.create({
        url,
        book_id,
        is_main,
      });
      resolve(newImage);
    } catch (error) {
      reject(error);
    }
  });
};

const changeMainImage = async (book_id, imageId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let mainImage = await db.bookimages.findOne({
        where: { book_id, is_main: 1 },
      });
      if (mainImage) {
        await db.bookimages.update(
          { is_main: 0 },
          { where: { bookImage_id: mainImage.bookImage_id } }
        );
      }
      let newMainImage = await db.bookimages.update(
        { is_main: 1 },
        { where: { bookImage_id: imageId } }
      );
      resolve(newMainImage);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteImage = async (imageId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let deletedImage = await db.bookimages.findOne({
        where: { bookImage_id: imageId },
      });
      if (!deletedImage) {
        throw new Error("Image not found");
      }
      if (fs.existsSync(`public/img/${deletedImage.url}`)) {
        //xoa file anh
        fs.unlinkSync(`public/img/${deletedImage.url}`);
      }
      //xoa anh trong db
      await db.bookimages.destroy({ where: { bookImage_id: imageId } });
      resolve(deletedImage);
    } catch (error) {
      reject(error);
    }
  });
};

const getMainImage = async (book_id) => {
  try {
    let mainImage = await db.bookimages.findOne({
      where: { book_id, is_main: 1 },
    });
    return mainImage;
  } catch (error) {
    throw new Error(error);
  }
};

const getOneAltImage = async (book_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let altImage = await db.bookimages.findOne({
        where: { book_id, is_main: 0 },
      });
      resolve(altImage);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createImage,
  changeMainImage,
  deleteImage,
  getMainImage,
  getOneAltImage,
};
