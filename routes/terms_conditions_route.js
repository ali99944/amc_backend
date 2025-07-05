import express from 'express';
import { getTermsConditionsController, updateTermsConditionsController } from '../controllers/terms_conditions_controller.js';
import { verifyManagerToken } from '../middlewares/manager_auth_middleware.js';

const router = express.Router();

// Routes for Terms and Conditions
router.get('/terms-conditions', getTermsConditionsController);
router.put('/terms-conditions', verifyManagerToken, updateTermsConditionsController);

export default router;
