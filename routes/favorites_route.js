import express from 'express';
import {
  addFavoriteSongController,
  removeFavoriteSongController,
  getFavoriteSongsController,
  addFavoriteArtistController,
  removeFavoriteArtistController,
  getFavoriteArtistsController,
  addFavoriteAlbumController,
  removeFavoriteAlbumController,
  getFavoriteAlbumsController,
} from '../controllers/favorites_controller.js';
import { verifyUserTokenMiddleware } from '../middlewares//user_auth_middleware.js';

const router = express.Router();

// Favorites: Songs
router.post('/favorites/songs', verifyUserTokenMiddleware, addFavoriteSongController);
router.delete('/favorites/songs/:song_id', verifyUserTokenMiddleware, removeFavoriteSongController);
router.get('/favorites/songs', verifyUserTokenMiddleware, getFavoriteSongsController);

// Favorites: Artists
router.post('/favorites/artists', verifyUserTokenMiddleware, addFavoriteArtistController);
router.delete('/favorites/artists/:artist_id', verifyUserTokenMiddleware, removeFavoriteArtistController);
router.get('/favorites/artists', verifyUserTokenMiddleware, getFavoriteArtistsController);

// Favorites: Albums
router.post('/favorites/albums', verifyUserTokenMiddleware, addFavoriteAlbumController);
router.delete('/favorites/albums/:album_id', verifyUserTokenMiddleware, removeFavoriteAlbumController);
router.get('/favorites/albums', verifyUserTokenMiddleware, getFavoriteAlbumsController);

export default router;