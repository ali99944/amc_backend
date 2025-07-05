// import moment from "moment"
// import { ApiError } from "../lib/api_error.js"
// import { compiled_mail_activation_template, host, port } from "../lib/configs.js"
// import { BAD_REQUEST_CODE, NOT_FOUND_CODE } from "../lib/error_codes.js"
// import prisma from "../lib/prisma.js"
// import { generateRandomString } from "../lib/random.js"
// import { encryptPassword, verifyPassword } from "../lib/security.js"
// import { sendMail } from "../lib/smtp_service.js"
// import { BAD_REQUEST_STATUS, NOT_FOUND_STATUS } from "../lib/status_codes.js"
// import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js"

// const sendActivationLink = async ({ email }) => new Promise(
//     async (resolve, reject) => {

//         const activation_code = generateRandomString(8)

//         await prisma.verification_codes.create({
//             data: {
//                 email,
//                 activation_code,
//             }
//         })

//         sendMail({
//             recipient: email,
//             subject: "Activate your account",
//             content: "Activate your account",
//             template: compiled_mail_activation_template({
//                 activationLink: `${host}:${port}/api/auth/users/activate?email=${email}&activation_code=${activation_code}`,
//                 year: new Date().getFullYear()
//             })
//         })
//         resolve({ success: true, email, activation_code })
//     }
// )

// const activateAccount = async ({ email, activation_code }) => new Promise(
//     async (resolve, reject) => {
//         const verification_code = await prisma.verification_codes.findFirst({
//             where: {
//                 email,
//                 activation_code
//             }
//         })
//         if (verification_code) {
//             await prisma.verification_codes.delete({
//                 where: {
//                     id: verification_code.id
//                 }
//             })

//             await prisma.users.update({
//                 where: {
//                     email
//                 },
//                 data: {
//                     status: "active"
//                 }
//             })
//             resolve({ success: true, email })
//         } else {
//             resolve({ success: false, message: "Invalid activation code" })
//         }
//     }
// )

// const banUser = async ({ user_id }) => new Promise(
//     async (resolve, reject) => {
//         await prisma.users.update({
//             where: {
//                 id: user_id
//             },
//             data: {
//                 status: "banned"
//             }
//         })
//         resolve({ success: true })
//     }
// )

// const loginUser = async ({ email, password }) => new Promise(
//     async (resolve, reject) => {
//         const user = await prisma.users.findFirst({
//             where: {
//                 email
//             }
//         })

//         if(!user) {
//             const user_not_found = new ApiError('User not found', NOT_FOUND_CODE, NOT_FOUND_STATUS)
//             return reject(user_not_found)
//         }

//         const is_password_verified = await verifyPassword(password, user?.password)

//         if(!is_password_verified) {
//             const password_invalid = new ApiError('Invalid password', BAD_REQUEST_CODE, BAD_REQUEST_STATUS)
//             return reject(password_invalid)
//         }

//         resolve(user)
//     }
// )

// const registerUser = async ({ email, name, password, genres, artists, birth_date, gender }) => new Promise(
//     promiseAsyncWrapper(
//         async (resolve, reject) => {
//             const existing_user = await prisma.users.findFirst({
//                 where: {
//                     email
//                 }
//             })

//             if (existing_user) {
//                 const user_already_exists = new ApiError('User already exists', BAD_REQUEST_CODE, BAD_REQUEST_STATUS)
//                 return reject(user_already_exists)
//             }

//             const date = moment(birth_date, 'YYYY-MM-DD')
//             const user = await prisma.users.create({
//                 data: {
//                     email,
//                     name,
//                     password: await encryptPassword(password),
//                     gender: gender,
//                     birth_date: date.toISOString(),
//                     genre_interests: {
//                         createMany: {
//                             data: genres.map(gen => {
//                                 return {
//                                     genre_id: gen
//                                 }
//                             })
//                         }
//                     },
//                     user_artist_interests: {
//                         createMany: {
//                             data: artists.map(art => {
//                                 return {
//                                     artist_id: art
//                                 }
//                             })
//                         }
//                     },
//                     role: 'basic'
//                 }
//             })

//             await sendActivationLink({ email })

//             resolve({ success: true, message: "User created successfully, please verify your account", user })
//         }
//     )
// )

// export {
//     sendActivationLink,
//     activateAccount,
//     banUser,
//     loginUser,
//     registerUser
// }