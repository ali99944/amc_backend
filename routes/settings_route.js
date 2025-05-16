import express from "express";
import { getSettingsController, saveSettingsController } from "../controllers/settings_controller.js";

const router = express.Router();

router.get('/settings/:key', getSettingsController)
router.put('/settings/:key', saveSettingsController)

export default router