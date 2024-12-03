const express = require("express");
const router = express.Router();
const { getDetailProductByID, getImagesForThumbnailController, getRelatedProductController, getGenreOfBookController } = require("../controllers/detailProductController");

router.get("/product", getDetailProductByID);
router.get("/images-thumbnail", getImagesForThumbnailController);
router.get("/related-product", getRelatedProductController)
router.get("/genre", getGenreOfBookController);

module.exports = router;