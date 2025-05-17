import express from "express"
import { addManagerPermissionController, createManagerController, getAllManagersController, getManagersPermissionsController, loginManagerController, removeManagerPermissionController, verifyManagerTokenController } from "../controllers/manager_controller.js"

const router = express.Router()

router.get('/managers', getAllManagersController)
router.post('/managers', createManagerController)
router.post('/managers/login', loginManagerController)
router.post('/managers/verify-token', verifyManagerTokenController)


router.get('/managers/:id/permissions', getManagersPermissionsController)
router.post('/managers/:id/permissions', addManagerPermissionController)
router.delete('/managers/:id/permissions', removeManagerPermissionController)

export default router