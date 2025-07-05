import express from 'express';
import { createAlbumController, deleteAlbumController, getAllAlbumsController, updateAlbumController } from '../controllers/album_controller.js';
import { createMulterStorage } from '../services/multer_storage.js';

// album_route.js
const router = express.Router();

router.get('/albums', getAllAlbumsController);
router.post('/albums', createMulterStorage('images', 'albums').single('image'), createAlbumController);
router.put('/albums/:id', createMulterStorage('images', 'albums').single('image'), updateAlbumController);
router.delete('/albums/:id', deleteAlbumController);

export default router;