import express from 'express';
import { getPrivacyPolicyController, updatePrivacyPolicyController } from '../controllers/privacy_policy_controller.js';
import { verifyManagerToken } from '../middlewares/manager_auth_middleware.js';

const router = express.Router();

// Routes for Privacy Policy
router.get('/privacy-policy', getPrivacyPolicyController);
router.put('/privacy-policy', verifyManagerToken, updatePrivacyPolicyController);

export default router;

