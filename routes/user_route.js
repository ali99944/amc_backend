// user_route.js
import express from 'express';
import {  completeOnboardingController, deleteUserController, deleteUserWithRelatedDataController, getAllUsersController, getCurrentUserController, getUserArtistPreferencesController, getUserGenrePreferencesController, getUserSettingsController, updateUserArtistPreferencesController, updateUserController, updateUserGenrePreferencesController, updateUserSettingsController } from '../controllers/user_controller.js';
import { activateAccountController, changePasswordController, forgotPasswordController, loginUserController, logoutUserController, refreshTokenController, registerUserController, resetPasswordController, sendRecoveryCodeController, verifyOtpController } from '../controllers/user_auth_controller.js';
import { verifyUserTokenMiddleware } from '../middlewares/user_auth_middleware.js';
import { createMulterStorage } from '../services/multer_storage.js';
import { verifyManagerToken } from '../middlewares/manager_auth_middleware.js';
import { getFollowedArtistsController } from '../controllers/artist_controller.js';

const router = express.Router();

// Auth routes (no token required)
router.post('/users/register', createMulterStorage('images', 'profiles').single('profile_picture'), registerUserController);
router.post('/users/login', loginUserController);
router.post('/users/logout', verifyUserTokenMiddleware, logoutUserController);
router.post('/users/refresh', refreshTokenController);
router.post('/users/activate', activateAccountController);
router.post('/users/forgot-password', forgotPasswordController);
router.post('/users/recovery-code', sendRecoveryCodeController);
router.post('/users/verify-otp', verifyOtpController);
router.post('/users/reset-password', resetPasswordController);

// User routes (protected by user token)
router.get('/me', verifyUserTokenMiddleware, getCurrentUserController);
router.get('/me/genres-interests', verifyUserTokenMiddleware, getUserGenrePreferencesController)
router.get('/me/artists-interests', verifyUserTokenMiddleware, getUserArtistPreferencesController)
router.post('/me/genres-interests', verifyUserTokenMiddleware, updateUserGenrePreferencesController)
router.post('/me/artists-interests', verifyUserTokenMiddleware, updateUserArtistPreferencesController)
router.get('/me/followed-artists', verifyUserTokenMiddleware, getFollowedArtistsController)
router.put('/me', verifyUserTokenMiddleware, createMulterStorage('images', 'profiles').single('profile_picture'), updateUserController);
router.delete('/me', verifyUserTokenMiddleware, deleteUserController);
router.post('/me/change-password', verifyUserTokenMiddleware, changePasswordController);

router.get(
    '/me/settings',
    verifyUserTokenMiddleware,
    getUserSettingsController
)

router.post(
    '/me/settings',
    verifyUserTokenMiddleware,
    updateUserSettingsController
)


router.post(
    '/me/onboarding',
    verifyUserTokenMiddleware,
    completeOnboardingController
)



// Manager routes (protected by manager token)
router.put('/users/:id/ban', verifyManagerToken, updateUserController);
router.get('/users', verifyManagerToken, getAllUsersController);
router.delete('/users/:id', verifyManagerToken, deleteUserWithRelatedDataController);


export default router;