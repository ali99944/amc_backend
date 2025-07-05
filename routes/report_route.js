import express from 'express';
import { getReportsController, createReportController, getReportController } from '../controllers/report_controller.js';
import { verifyManagerToken } from '../middlewares/manager_auth_middleware.js';

const router = express.Router();

router.get('/reports', verifyManagerToken, getReportsController);
router.post('/reports', verifyManagerToken, createReportController);
router.get('/reports/:id', verifyManagerToken, getReportController);

export default router;