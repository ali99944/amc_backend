import { generateToken } from "../lib/security.js";
import { OK_STATUS } from "../lib/status_codes.js";
import Validator from "../lib/validator.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";
import { activateAccount, loginUser, registerUser } from "../services/authentication_service.js";

export const registerUserController = asyncWrapper(
    async (req, res) => {
        const { email, name, password, birth_date, gender, genres, artists } = req.body
        // console.log({
        //     email, name, password, birth_date, gender, genres, artists
        // });
        // return res.json("ok")
        
        await Validator.validateNotNull({ email, name, password, birth_date, gender })
        await Validator.isArray(genres)
        await Validator.isArray(artists)
        await Validator.isEnum(gender, ['male', 'female', 'other'], "gender must be either 'male', 'female' or 'other'")
        // await Validator.minArrayLength(genres, 3, "genres length must be at least 3")

        const user = await registerUser({ email, name, password, genres, artists, birth_date, gender })

        return res.status(OK_STATUS).json(user)
    }
)


export const getAuthenticatedUserController = asyncWrapper(
    async (req, res) => {
        const token = req.headers.authorization
        const payload = await verifyToken(token)

        const user = await prisma.users.findUnique({
            where: {
                id: payload.id
            },

            omit: {
                password: true
            }
        })

        return res.status(OK_STATUS).json(user)
    }
)

export const loginUserController = asyncWrapper(
    async (req, res) => {
        const { email, password } = req.body

        const user = await loginUser({ email, password })
        const token = await generateToken(user)

        return res.status(OK_STATUS).json({ user, token, success: true })
    }
)

export const activateAccountController = asyncWrapper(
    async (req, res) => {
        const { email, activation_code } = req.query

        await activateAccount({ email, activation_code })

        return res.status(OK_STATUS).json({
            success: true
        })
    }
)