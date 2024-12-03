import express from "express";
import AccountController from "../controllers/accountController";

let router = express.Router();

// Endpoint lấy dữ liệu phân trang
router.get("/", AccountController.handleGetPage);

router.get("/references", AccountController.getAllReferences);

router.post("/:id", AccountController.handleUpdate);

module.exports = router;
