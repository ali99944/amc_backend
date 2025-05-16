import express from "express"
import { banUserController, deleteUserController, getAllUsersController, updateUserController, updateUserPasswordController, verifyUserTokenController } from "../controllers/users_controller.js"
import isAdmin from "../middlewares/is_admin.js"

const router = express.Router()

router.get('/users', getAllUsersController)
router.put('/users/:id', updateUserController)
router.put('/users/:id/password', updateUserPasswordController)

router.post('/users/verify-token', verifyUserTokenController)

router.post('/users/:id/ban', banUserController)

router.delete('/users/:id', deleteUserController)



router.get('/users/:id/playlists')
router.post('/users/:id/playlists')

router.get('/users/:id/following')
router.get('/users/:id/favorites')
router.get('/users/:id/genre-interests')

export default router