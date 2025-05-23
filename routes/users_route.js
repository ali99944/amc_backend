import express from "express"
import { banUserController, deleteUserController, getAllUsersController, updateUserController } from "../controllers/users_controller.js"

const router = express.Router()

router.get('/users', getAllUsersController)
router.put('/users/:id', updateUserController)
router.post('/users/:id/ban', banUserController)

router.delete('/users/:id', deleteUserController)



router.get('/users/:id/playlists')
router.post('/users/:id/playlists')

router.get('/users/:id/following')
router.get('/users/:id/favorites')
router.get('/users/:id/genre-interests')



export default router