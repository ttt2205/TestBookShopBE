const express = require('express');
const router = express.Router();
const { getAllBillPromotionsController, insertOrderController } = require('../controllers/cartController');

router.get("/promotion", getAllBillPromotionsController);
router.post("/order", insertOrderController);

module.exports = router;