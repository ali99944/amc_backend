import prisma from "../lib/prisma.js";
import { OK } from "../lib/status_codes.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";

export const getSettingsController = asyncWrapper(
    async (req, res) => {
        const { key } = req.params

        const settings = await prisma.settings.findFirst({
            where: {
                key: key
            }
        })

        return res.status(OK).json(settings)
    }
)

export const saveSettingsController = asyncWrapper(
    async (req, res) => {
        const { key } = req.params
        const { controls } = req.body

        await prisma.settings.upsert({
            where: { key: key },
            update: { controls: controls },
            create: { key: key, controls: controls }
        })

        return res.status(OK).json({ success: true })
    }
)

