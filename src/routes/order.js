import express from "express";
const { handleGetPage, handleCreate, getOrderbyEmailController } = require("../controllers/orderController");

const router = express.Router();
router.get("/", handleGetPage);
// router.post("/", handleCreate);
router.get("/order-by-email", getOrderbyEmailController);
// router.get("/:orderId", orderController.handleGetById);
// router.get("/status/all", orderController.handleGetAllProviders);

module.exports = router;
