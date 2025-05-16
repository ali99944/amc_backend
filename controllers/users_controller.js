import prisma from "../lib/prisma.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";

export const getAllUsersController = asyncWrapper(
    async (_req, res) => {
        const users = await prisma.users.findMany()
        return res.status(200).json(users)
    }
)

export const updateUserController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { name, username, email } = req.body

        await prisma.users.update({
            where: {
                id: user_id
            },
            data: {
                status
            }
        })

        return res.status(200).json({ success: true })
    }
)

export const updateUserPasswordController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { old_password, new_password, confirm_password } = req.body

        if (new_password !== confirm_password) {
            return res.status(400).json({ success: false, message: "Passwords must match" })
        }

        const user = await prisma.users.findUnique({
            where: {
                id
            }
        })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const is_password_verified = await verifyPassword(old_password, user.password)

        if (!is_password_verified) {
            return res.status(400).json({ success: false, message: "Old password is incorrect" })
        }

        await prisma.users.update({
            where: {
                id: user_id
            },
            data: {
                password: new_password
            }
        })

        return res.status(200).json({ success: true })
    }
)

export const banUserController = asyncWrapper(
    async (req, res) => {
        const { user_id } = req.body
        await prisma.users.update({
            where: {
                id: user_id
            },
            data: {
                status: "banned"
            }
        })
        return res.status(200).json({ success: true })
    }
)

export const verifyUserTokenController = asyncWrapper(
    async (req, res) => {
        const token = req.headers.authorization

        if (!token) {
            return res.status(200).json({ success: false, message: "You are not authenticated" })
        }

        const payload = verifyToken(token)

        const user = await prisma.users.findUnique({
            where: {
                id: payload.id
            }
        })

        if (!user) {
            return res.status(200).json({ success: false, message: "User not found" })
        }

        return res.status(200).json({ success: true, user })
    }
)

export const deleteUserController = asyncWrapper(
    async (req, res) => {
        const { user_id } = req.body
        await prisma.users.delete({
            where: {
                id: user_id
            }
        })
        return res.status(200).json({ success: true })
    }
)