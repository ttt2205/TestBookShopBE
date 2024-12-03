import express from "express";
import ProviderController from "../controllers/providerController";

const router = express.Router();
router.get("/all", ProviderController.handleGetAll);

module.exports = router;
