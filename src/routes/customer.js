const express = require("express");
const router = express.Router();
const { registerCustomerController, getCustomerInfoController, updateCustomerInfoController } = require("../controllers/customerController");


router.post("/register", registerCustomerController);
router.get("/info", getCustomerInfoController);
router.put("/update", updateCustomerInfoController);


module.exports = router; 