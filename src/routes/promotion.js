import { Router } from "express";

import promotionController from "../controllers/promotionController";

let router = Router();
// router.get("/page/:pageNum", promotionController.handleGetPage);
router.get("/bill-promotion", promotionController.handleGetAllPromotion);
router.post("/bill-promotion", promotionController.handleCreatePromotion);
router.get("/bill-promotion/:id", promotionController.handleGetPromotionById);
router.post("/bill-promotion/:id", promotionController.handleUpdatePromotion);

router.get("/discount", promotionController.handleGetAllDiscount);
router.post("/discount", promotionController.handleCreateDiscount);
router.get("/discount/:id", promotionController.handleGetDiscountById);
router.post("/discount/:id", promotionController.handleUpdateDiscount);

router.get("/genre", promotionController.handleGetAllGenres);
router.post("/apply-discount/:id", promotionController.handleApplyDiscount);

module.exports = router;
