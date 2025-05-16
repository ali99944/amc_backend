import prisma from "../lib/prisma.js"
import { encryptPassword, generateAdminToken, verifyAdminToken, verifyPassword } from "../lib/security.js"
import { OK } from "../lib/status_codes.js"
import Validator from "../lib/validator.js"
import asyncWrapper from "../lib/wrappers/async_wrapper.js"

export const getAllManagersController = asyncWrapper(
    async (req, res) => {
        const managers = await prisma.managers.findMany()
        return res.status(OK).json(managers)
    }
)

export const createManagerController = asyncWrapper(
    async (req, res) => {
        const { name, username, password } = req.body
        await Validator.validateNotNull({ name, username, password })

        const hashed_password = await encryptPassword(password)
        const manager = await prisma.managers.create({
            data: {
                name,
                username,
                password: hashed_password
            }
        })

        return res.status(OK).json(manager)
    }
)

export const loginManagerController = asyncWrapper(
    async (req, res) => {
        const { username, password } = req.body
        await Validator.validateNotNull({ username, password })
        
        const manager = await prisma.managers.findUnique({
            where: {
                username
            }
        })

        if (!manager) {
            return res.status(OK).json({ success: false, message: "Manager not found" })
        }

        const is_password_verified = await verifyPassword(password, manager.password)
        
        if (!is_password_verified) {
            return res.status(OK).json({ success: false, message: "Invalid password" })
        }

        const token = await generateAdminToken({ id: manager.id })

        return res.status(OK).json({ success: true, manager, token })
    }
)

export const verifyManagerTokenController = asyncWrapper(
    async (req, res) => {
        const token = req.headers.authorization

        if (!token) {
            return res.status(OK).json({ success: false, message: "You are not authenticated" })
        }

        const payload = verifyAdminToken(token)

        const manager = await prisma.managers.findUnique({
            where: {
                id: payload.id
            }
        })

        if (!manager) {
            return res.status(OK).json({ success: false, message: "Manager not found" })
        }

        return res.status(OK).json({ success: true, manager })
    }
)


export const deleteManagerController = asyncWrapper(
    async (req, res) => {
        const { manager_id } = req.body
        await prisma.managers.delete({
            where: {
                id: manager_id
            }
        })
        return res.status(OK).json({ success: true })
    }
)


export const addManagerPermissionController = asyncWrapper(
    async (req, res) => {
        const { manager_id, permission } = req.body
        const { name, value } = permission
        await prisma.manager_permissions.create({
            data: {
                id: manager_id,
                name,
                value
            }
        })
        return res.status(OK).json({ success: true })
    }
)

export const removeManagerPermissionController = asyncWrapper(
    async (req, res) => {
        const { manager_id } = req.body

        await prisma.manager_permissions.delete({
            where: {
                id: manager_id
            }
        })
        return res.status(OK).json({ success: true })
    }
)

export const getManagersPermissionsController = asyncWrapper(
    async (req, res) => {
        const { manager_id } = req.body
        const permissions = await prisma.manager_permissions.findMany({
            where: {
                id: manager_id
            }
        })
        return res.status(OK).json({ success: true, permissions })
    }
)