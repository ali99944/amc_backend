import express from 'express';
import { getReportsController, createReportController, getReportController, deleteReportController } from '../controllers/report_controller.js';
import { verifyManagerToken } from '../middlewares/manager_auth_middleware.js';

const router = express.Router();

router.get('/reports', verifyManagerToken, getReportsController);
router.post('/reports', verifyManagerToken, createReportController);
router.get('/reports/:id', verifyManagerToken, getReportController);


router.delete('/reports/:id', verifyManagerToken, deleteReportController)

export default router;