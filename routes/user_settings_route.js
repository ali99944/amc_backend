import express from 'express';
import { getUserSettingsController, updateUserSettingsController } from '../controllers/user_settings_controller.js';
import { verifyUserTokenMiddleware } from '../middlewares/user_auth_middleware.js';

const router = express.Router();

// User or manager can get settings
router.get('/user-settings', verifyUserTokenMiddleware,  getUserSettingsController);
// Only user or manager can update settings
router.patch('/user-settings', verifyUserTokenMiddleware,  updateUserSettingsController);

export default router;