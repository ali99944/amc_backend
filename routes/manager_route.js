import express from "express"
import {
    addManagerPermissionController,
    createManagerController,
    deleteManager,
    getAllManagersController,
    getManagersPermissionsController,
    loginManagerController,
    logoutManager,
    removeManagerPermissionController,
    verifyManagerTokenController
} from "../controllers/manager_controller.js"

const router = express.Router()

router.get('/managers', getAllManagersController)
router.post('/managers', createManagerController)
router.post('/managers/login', loginManagerController)
router.get('/managers/verify-token', verifyManagerTokenController)
router.post('/managers/logout', logoutManager)
router.delete('/managers/:manager_id', deleteManager)


router.get('/managers/:id/permissions', getManagersPermissionsController)
router.post('/managers/:id/permissions', addManagerPermissionController)
router.delete('/managers/:id/permissions', removeManagerPermissionController)

export default router