const express = require("express");
const router = express.Router();
const { postForgotPasswordController, postResetPasswordController } = require("../controllers/forgotPasswordController");


router.post("/", postForgotPasswordController);
router.post("/reset-password", postResetPasswordController);

module.exports = router;