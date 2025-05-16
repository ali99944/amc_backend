import express from 'express'
import { getUserGrowthController } from '../controllers/analytics_controller.js'

const router = express.Router()

router.get('/analytics/user-growth', getUserGrowthController)

export default router