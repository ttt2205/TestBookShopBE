import express from "express";
import PurchaseController from "../controllers/purchaseController";

const router = express.Router();
router.get("/", PurchaseController.handleGetPage);
router.post("/", PurchaseController.handleCreate);
router.get("/:receiptId", PurchaseController.handleGetById);
router.get("/providers/all", PurchaseController.handleGetAllProviders);

module.exports = router;
