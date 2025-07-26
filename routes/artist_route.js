import express from 'express';
import { createArtistController, deleteArtistController, getAllArtistsController, getArtistProfileController, isUserFollowingArtistController, updateArtistController } from '../controllers/artist_controller.js';
import { createMulterStorage } from '../services/multer_storage.js';
import { followArtistController, unfollowArtistController } from '../controllers/artist_controller.js';
import { verifyUserTokenMiddleware } from '../middlewares/user_auth_middleware.js';

// artist_route.js
const router = express.Router();

router.get(
    '/artists/:id/is-followed', 
    verifyUserTokenMiddleware,
    isUserFollowingArtistController
)


router.post('/artists/:id/follow', verifyUserTokenMiddleware, followArtistController);
router.post('/artists/:id/unfollow', verifyUserTokenMiddleware, unfollowArtistController);

router.get('/artists', getAllArtistsController);
router.post('/artists', createMulterStorage('images', 'artists').single('image'), createArtistController);
router.put('/artists/:id', createMulterStorage('images', 'artists').single('image'), updateArtistController);
router.delete('/artists/:id', deleteArtistController);

router.get('/artists/:id/profile', getArtistProfileController)


export default router;
