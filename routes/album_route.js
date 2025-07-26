// src/routes/album_route.js

import express from 'express';
import { 
    getAllAlbumsController, 
    getAlbumByIdController, 
    createAlbumController, 
    updateAlbumController, 
    deleteAlbumController, 
    getNewReleasesController
} from '../controllers/album_controller.js';
import { verifyManagerToken, restrictTo } from '../middlewares/manager_auth_middleware.js';
import { PERMISSIONS } from '../lib/permissions.js';
import { createMulterStorage } from '../services/multer_storage.js';

const router = express.Router();

// Public routes (anyone can view albums)
router.get('/albums', getAllAlbumsController);
router.get('/albums/new-releases', getNewReleasesController);
router.get('/albums/:id', getAlbumByIdController);

// Protected routes (only authorized managers can create, update, delete)
router.post(
    '/albums', 
    verifyManagerToken, 
    restrictTo(PERMISSIONS.ALBUM.CREATE), 
    createMulterStorage('images', 'albums_cover').single('image'),
    createAlbumController
);

router.put(
    '/albums/:id', 
    verifyManagerToken, 
    restrictTo(PERMISSIONS.ALBUM.UPDATE), 
    createMulterStorage('images', 'albums_cover').single('image'),
    updateAlbumController
);

router.delete(
    '/albums/:id', 
    verifyManagerToken, 
    restrictTo(PERMISSIONS.ALBUM.DELETE), 
    deleteAlbumController
);

export default router;