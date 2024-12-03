import express from "express";
import homeController from "../controllers/homeController";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.filename + uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", homeController.getHomePage);

router.get("/upload", homeController.getInputPage);
router.post("/upload", upload.array("file", 10), homeController.postInputPage);

// router.get("/crud", homeController.getCRUD);

// router.post("/post-crud", homeController.postCRUD);

// router.get("/get-crud", homeController.displayGetCRUD);

// router.get("/edit-crud", homeController.getEditCRUD);

// router.post("/put-crud", homeController.putCRUD);

// router.get("/delete-crud", homeController.deleteCRUD);

module.exports = router;
