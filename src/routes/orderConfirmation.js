const express = require("express");
const router = express.Router();
const { getOrdersController, updateStatusOrderController } = require("../controllers/orderConfirmationController");

router.get("/orders", getOrdersController);
router.put("/confirm", updateStatusOrderController);


module.exports = router;