import express from 'express';
import {
    getSettingsController,
    getSettingsByKeyController,
    updateSettingsController,
    overrideSettingsController
} from '../controllers/settings_controller.js';

import {
    verifyManagerToken
} from '../middlewares/manager_auth_middleware.js';

const router = express.Router();

router.get('/settings', getSettingsController);
router.post('/settings', verifyManagerToken, overrideSettingsController);
router.get('/settings/:key', verifyManagerToken, getSettingsByKeyController);
router.patch('/settings/:key', verifyManagerToken, updateSettingsController);

export default router;