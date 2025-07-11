import { Router } from "express"
import { getAllPermissionsController, storeManagerPermissionsController } from "../controllers/permission_controller.js"
import { verifyManagerToken } from "../middlewares/manager_auth_middleware.js"

const router = Router()

router.get('/permissions', verifyManagerToken, getAllPermissionsController)
router.post('/managers/permissions', verifyManagerToken, storeManagerPermissionsController)


export default router