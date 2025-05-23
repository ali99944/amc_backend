import { Router } from "express"
import { activateAccountController, getAuthenticatedUserController, loginUserController, registerUserController } from "../controllers/authentication_controller.js"
import { updateUserPasswordController, verifyUserTokenController } from "../controllers/users_controller.js"

const router = Router()

router.post("/users/register", registerUserController)
router.post("/users/login", loginUserController)
router.get('/users/current-user', getAuthenticatedUserController)
router.post('/users/activate', activateAccountController)

router.get('/users/verify-token', verifyUserTokenController)
router.put('/users/:id/password', updateUserPasswordController)

export default router