import express from "express";
import { createUserListController, deleteUserListController, getAllUserListsController, getUserListController, updateUserListController } from "../controllers/user_lists_controller.js";


const router = express.Router()

router.get('/user-lists', getAllUserListsController)
router.get('/user-lists/:id', getUserListController)
router.post('/user-lists', createUserListController)
router.put('/user-lists/:id', updateUserListController)
router.delete('/user-lists/:id', deleteUserListController)


export default router