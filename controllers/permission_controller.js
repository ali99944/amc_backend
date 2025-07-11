import { PERMISSIONS } from "../lib/permissions.js";
import { OK_STATUS } from "../lib/status_codes.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";

export const getAllPermissionsController = asyncWrapper(
    async (_, res) => {
        console.log(' iwas gdgad');
        
        return res.status(OK_STATUS).json(PERMISSIONS)
    }
)

export const storeManagerPermissionsController = asyncWrapper(
    async (req, res) => {
        console.log(req.body);
        const { id, permissions } = req.body;
        
        
        // const { id } = req.manager;
        await prisma.manager_permissions.deleteMany({
            where: {
                manager_id: id,
            },
        });
        await prisma.manager_permissions.createMany({
            data: permissions.map(perm => ({
                manager_id: id,
                name: perm,
            })),
        });
        return res.status(OK_STATUS).json({ message: 'Permissions stored successfully' });
    }
)
