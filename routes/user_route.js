// user_route.js
import express from 'express';
import {  deleteUserController, deleteUserWithRelatedDataController, getAllUsersController, getCurrentUserController, updateUserController } from '../controllers/user_controller.js';
import { activateAccountController, changePasswordController, forgotPasswordController, loginUserController, logoutUserController, refreshTokenController, registerUserController, resetPasswordController, verifyOtpController } from '../controllers/user_auth_controller.js';
import { verifyUserTokenMiddleware } from '../middlewares/user_auth_middleware.js';
import { createMulterStorage } from '../services/multer_storage.js';
import { verifyManagerToken } from '../middlewares/manager_auth_middleware.js';

const router = express.Router();

// Auth routes (no token required)
router.post('/users/register', createMulterStorage('images', 'profiles').single('profile_picture'), registerUserController);
router.post('/users/login', loginUserController);
router.post('/users/logout', logoutUserController);
router.post('/users/refresh', refreshTokenController);
router.post('/users/activate', activateAccountController);
router.post('/users/forgot-password', forgotPasswordController);
router.post('/users/verify-otp', verifyOtpController);
router.post('/users/reset-password', resetPasswordController);

// User routes (protected by user token)
router.get('/users/me', verifyUserTokenMiddleware, getCurrentUserController);
router.put('/users/me', verifyUserTokenMiddleware, createMulterStorage('images', 'profiles').single('profile_picture'), updateUserController);
router.delete('/users/me', verifyUserTokenMiddleware, deleteUserController);
router.post('/users/change-password', verifyUserTokenMiddleware, changePasswordController);

// Manager routes (protected by manager token)
router.put('/users/:id/ban', verifyManagerToken, updateUserController);
router.get('/users', verifyManagerToken, getAllUsersController);
router.delete('/users/:id', verifyManagerToken, deleteUserWithRelatedDataController);

export default router;