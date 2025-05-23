import express from "express";
import { createUserListController, deleteUserListController, getAllUserListsController, getUserListController, updateUserListController } from "../controllers/user_lists_controller.js";


const router = express.Router()

router.get('/users-list', getAllUserListsController)
router.get('/users-list/:id', getUserListController)
router.post('/users-list', createUserListController)
router.put('/users-list/:id', updateUserListController)
router.delete('/users-list/:id', deleteUserListController)

export default router