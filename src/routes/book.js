import express from "express";
import bookController from "../controllers/bookController";
import { checkAdmin as checkAdminMiddleware } from "../controllers/authController";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/img"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    let fileName = uniqueSuffix + "-" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

let router = express.Router();

router.get("/", bookController.handleGetPage);
router.get("/:bookId", bookController.handleGetById);
router.post(
  "/:bookId",
  checkAdminMiddleware,
  upload.array("new_images", 10),
  bookController.handleUpdate
);
router.get("/reference/all", bookController.handleGetAllReferences);
router.post(
  "/",
  checkAdminMiddleware,
  upload.array("new_images", 10),
  bookController.handleCreate
);
router.get("/reference/genres", bookController.handleGenres);
module.exports = router;
