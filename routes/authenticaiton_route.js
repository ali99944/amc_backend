import express from "express"
import { activateAccountController, getAuthenticatedUserController, loginUserController, registerUserController } from "../controllers/authentication_controller.js"

const router = express.Router()

router.post("/auth/login", loginUserController)

router.post("/auth/register", registerUserController)

router.get('/auth/me', getAuthenticatedUserController)

router.get('/auth/users/activate', activateAccountController)

export default router