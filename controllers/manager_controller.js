import { ApiError } from "../lib/api_error.js"
import { BAD_REQUEST_CODE } from "../lib/error_codes.js"
import prisma from "../lib/prisma.js"
import { encryptPassword, generateAdminToken, verifyAdminToken, verifyPassword } from "../lib/security.js"
import { BAD_REQUEST_STATUS, OK_STATUS } from "../lib/status_codes.js"
import Validator from "../lib/validator.js"
import asyncWrapper from "../lib/wrappers/async_wrapper.js"

export const getAllManagersController = asyncWrapper(
    async (req, res) => {
        // const {
        //     page = 1, limit = 10, 
        //     sortBy = 'created_at',
        //     sortOrder = 'desc',
        //     search // For order_number
        // } = queryParams;

        // const filters = {};

        // if (search) filters.order_number = { contains: search, mode: 'insensitive' };

        // const orders = await prisma.orders.findMany({
        //     where: filters,
        //     include: {},
        //     orderBy: { [sortBy]: sortOrder },
        //     skip: (parseInt(page) - 1) * parseInt(limit),
        //     take: parseInt(limit),
        // });

        const managers = await prisma.managers.findMany({
            include: {
                permissions: true
            }
        })
        return res.status(OK_STATUS).json(managers)
    }
)

export const createManagerController = asyncWrapper(
    async (req, res, next) => {
        const { name, username, password, email } = req.body
        await Validator.validateNotNull({ name, username, password })
        
        const existing_manager = await prisma.managers.findUnique({
            where: {
                username
            }
        })

        if(existing_manager) {
            return next(
                new ApiError('a manager with this username already exists', BAD_REQUEST_CODE, BAD_REQUEST_STATUS)
            )
        }

        const hashed_password = await encryptPassword(password)
        const manager = await prisma.managers.create({
            data: {
                name,
                username,
                email,
                password: hashed_password
            }
        })

        return res.status(OK_STATUS).json(manager)
    }
)

export const loginManagerController = asyncWrapper(
    async (req, res) => {
        const { username, password } = req.body
        await Validator.validateNotNull({ username, password })
        
        const manager = await prisma.managers.findUnique({
            where: {
                username
            },

            include: {
                permissions: true
            }
        })

        if (!manager) {
            return res.status(OK_STATUS).json({ success: false, message: "Manager not found" })
        }

        const is_password_verified = await verifyPassword(password, manager.password)
        
        if (!is_password_verified) {
            return res.status(OK_STATUS).json({ success: false, message: "Invalid password" })
        }

        const token = await generateAdminToken({ id: manager.id })

        return res.status(OK_STATUS).json({ success: true, manager, token })
    }
)

export const verifyManagerTokenController = asyncWrapper(
    async (req, res) => {
        const token = req.headers.authorization

        if (!token) {
            return res.status(OK_STATUS).json({ success: false, message: "You are not authenticated" })
        }

        const payload = verifyAdminToken(token)

        const manager = await prisma.managers.findUnique({
            where: {
                id: payload.id
            }
        })

        if (!manager) {
            return res.status(OK_STATUS).json({ success: false, message: "Manager not found" })
        }

        return res.status(OK_STATUS).json({ success: true, manager })
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
        return res.status(OK_STATUS).json({ success: true })
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
        return res.status(OK_STATUS).json({ success: true })
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
        return res.status(OK_STATUS).json({ success: true })
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
        return res.status(OK_STATUS).json({ success: true, permissions })
    }
)


export const deleteManager = asyncWrapper(
    async (req, res) => {
        const { manager_id } = req.body
        await prisma.managers.delete({
            where: {
                id: manager_id
            }
        })
        return res.status(OK_STATUS).json({ success: true })
    }
)

export const logoutManager = asyncWrapper(
    async (req, res) => {
        res.clearCookie('token')
        return res.status(OK_STATUS).json({ success: true })
    }
)