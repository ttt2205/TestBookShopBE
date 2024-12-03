import express from "express";
import discountController from "../controllers/discountController";

const router = express.Router();
router.get("/", discountController.handleGetPage);
// router.post("/", discountController.handleCreate);
// router.get("/:orderId", discountController.handleGetById);
// router.get("/status/all", discountController.handleGetAllProviders);

module.exports = router;
