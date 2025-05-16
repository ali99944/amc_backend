import { BAD_REQUEST, OK } from "../lib/status_codes.js"
import Validator from "../lib/validator.js"
import asyncWrapper from "../lib/wrappers/async_wrapper.js"
import { createUserList, deleteUserList, getAllUserLists, getUserList, updateUserList } from "../services/user_list.js"
import CustomError from "../utils/custom_error.js"

export const getAllUserListsController = asyncWrapper(
    async (_, res) => {
        const user_lists = await getAllUserLists()
        return res.status(OK).json(user_lists)
    }
)

export const getUserListController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const user_list = await getUserList(id)
        if(!user_list) {
            const user_list_not_found_error = new CustomError("User list not found", BAD_REQUEST)
            return next(user_list_not_found_error)
        }
        return res.status(OK).json(user_list)
    }
)

export const createUserListController = asyncWrapper(
    async (req, res) => {
        const { name, description, cover_image } = req.body
        await Validator.validateNotNull({ name, description, cover_image })
        
        const user_list = await createUserList({
            name,
            description,
            cover_image
        })
        return res.status(OK).json(user_list)
    }
)

export const updateUserListController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { name, description, cover_image } = req.body
        await Validator.validateNotNull({ name, description, cover_image })
        
        const user_list = await updateUserList({
            id,
            payload: { name, description, cover_image }
        })
        return res.status(OK).json(user_list)
    }
)

export const deleteUserListController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        await deleteUserList(id)
        return res.status(OK).json({ success: true })
    }
)