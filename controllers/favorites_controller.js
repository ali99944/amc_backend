import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import Validator from '../lib/validator.js';
import { OK_STATUS } from '../lib/status_codes.js';
import {
  addFavoriteSong,
  removeFavoriteSong,
  getFavoriteSongs,
  addFavoriteArtist,
  removeFavoriteArtist,
  getFavoriteArtists,
  addFavoriteAlbum,
  removeFavoriteAlbum,
  getFavoriteAlbums,
} from '../services/favorites_service.js';

export const addFavoriteSongController = asyncWrapper(async (req, res) => {
  const { song_id } = req.body;
  const user_id = req.user.id;

  await Validator.validateNotNull({ song_id });
  await Validator.isNumber(song_id, { integer: true, min: 1 });

  await addFavoriteSong({ user_id, song_id: Number(song_id) });

  return res.status(OK_STATUS).json({ message: 'Song added to favorites' });
});

export const removeFavoriteSongController = asyncWrapper(async (req, res) => {
  const { song_id } = req.params;
  const user_id = req.user.id;

  await Validator.isNumber(song_id, { integer: true, min: 1 });

  await removeFavoriteSong({ user_id, song_id: Number(song_id) });

  return res.status(OK_STATUS).json({ message: 'Song removed from favorites' });
});

export const getFavoriteSongsController = asyncWrapper(async (req, res) => {
  const { limit, offset } = req.query;
  const user_id = req.user.id;

  if (limit) await Validator.isNumber(limit, { integer: true, min: 1, max: 50 });
  if (offset) await Validator.isNumber(offset, { integer: true, min: 0 });

  const songs = await getFavoriteSongs({
    user_id,
    limit: limit ? Number(limit) : 10,
    offset: offset ? Number(offset) : 0,
  });

  return res.status(OK_STATUS).json(songs);
});

export const addFavoriteArtistController = asyncWrapper(async (req, res) => {
  const { artist_id } = req.body;
  const user_id = req.user.id;

  await Validator.validateNotNull({ artist_id });
  await Validator.isNumber(artist_id, { integer: true, min: 1 });

  await addFavoriteArtist({ user_id, artist_id: Number(artist_id) });

  return res.status(OK_STATUS).json({ message: 'Artist added to favorites' });
});

export const removeFavoriteArtistController = asyncWrapper(async (req, res) => {
  const { artist_id } = req.params;
  const user_id = req.user.id;

  await Validator.isNumber(artist_id, { integer: true, min: 1 });

  await removeFavoriteArtist({ user_id, artist_id: Number(artist_id) });

  return res.status(OK_STATUS).json({ message: 'Artist removed from favorites' });
});

export const getFavoriteArtistsController = asyncWrapper(async (req, res) => {
  const { limit, offset } = req.query;
  const user_id = req.user.id;

  if (limit) await Validator.isNumber(limit, { integer: true, min: 1, max: 50 });
  if (offset) await Validator.isNumber(offset, { integer: true, min: 0 });

  const artists = await getFavoriteArtists({
    user_id,
    limit: limit ? Number(limit) : 10,
    offset: offset ? Number(offset) : 0,
  });

  return res.status(OK_STATUS).json(artists);
});

export const addFavoriteAlbumController = asyncWrapper(async (req, res) => {
  const { album_id } = req.body;
  const user_id = req.user.id;

  await Validator.validateNotNull({ album_id });
  await Validator.isNumber(album_id, { integer: true, min: 1 });

  await addFavoriteAlbum({ user_id, album_id: Number(album_id) });

  return res.status(OK_STATUS).json({ message: 'Album added to favorites' });
});

export const removeFavoriteAlbumController = asyncWrapper(async (req, res) => {
  const { album_id } = req.params;
  const user_id = req.user.id;

  await Validator.isNumber(album_id, { integer: true, min: 1 });

  await removeFavoriteAlbum({ user_id, album_id: Number(album_id) });

  return res.status(OK_STATUS).json({ message: 'Album removed from favorites' });
});

export const getFavoriteAlbumsController = asyncWrapper(async (req, res) => {
  const { limit, offset } = req.query;
  const user_id = req.user.id;

  if (limit) await Validator.isNumber(limit, { integer: true, min: 1, max: 50 });
  if (offset) await Validator.isNumber(offset, { integer: true, min: 0 });

  const albums = await getFavoriteAlbums({
    user_id,
    limit: limit ? Number(limit) : 10,
    offset: offset ? Number(offset) : 0,
  });

  return res.status(OK_STATUS).json(albums);
});