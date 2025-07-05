import express from 'express';
import { createArtistController, deleteArtistController, getAllArtistsController, updateArtistController } from '../controllers/artist_controller.js';
import { createMulterStorage } from '../services/multer_storage.js';

// artist_route.js
const router = express.Router();

router.get('/artists', getAllArtistsController);
router.post('/artists', createMulterStorage('images', 'artists').single('image'), createArtistController);
router.put('/artists/:id', createMulterStorage('images', 'artists').single('image'), updateArtistController);
router.delete('/artists/:id', deleteArtistController);

export default router;
