import express from "express";
import thongKeController from "../controllers/thongKeController";

const router = express.Router();
router.get("/receipts", thongKeController.handleGetReceipts);
router.get("/accession", thongKeController.handleGetAccessLogs);
router.get("/revenue", thongKeController.handleGetRevenueAndProfit);
router.get("/sale-trending", thongKeController.handleGetSaleTrending);

module.exports = router;
