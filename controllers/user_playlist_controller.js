// user_playlist_controller.js
import {  OK_STATUS } from '../lib/status_codes.js';
import Validator from '../lib/validator.js';
import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import { createUserPlaylist, renameUserPlaylist, addSongsToUserPlaylist, copySystemPlaylist, getUserPlaylists, deleteUserPlaylist } from '../services/user_playlist_service.js';

export const getUserPlaylistsController = asyncWrapper(
  async (req, res) => {
    console.log(req.user);
    
    const playlists = await getUserPlaylists(req.user.id);
    console.log(playlists);
    
    return res.status(OK_STATUS).json(playlists);
  }
);

export const createUserPlaylistController = asyncWrapper(
  async (req, res) => {
    const { name, description, song_ids } = req.body;
    const image_file = req.file;
    const user_id = req.user.id;

    // Validate inputs
    await Validator.validateNotNull({ name });
    await Validator.isText(name, { minLength: 2, maxLength: 100 });
    if (description) await Validator.isText(description, { minLength: 0, maxLength: 500 });
    if (song_ids) {
      const parsedSongs = JSON.parse(song_ids || '[]');
      await Validator.isArray(parsedSongs, { minLength: 0, maxLength: 100, arrayName: 'song_ids' });
      for (const id of parsedSongs) {
        await Validator.isNumber(id, { integer: true, min: 1 });
      }
    }
    if (image_file) {
      await Validator.validateFile(image_file, {
        allowedTypes: ['image/jpeg', 'image/png'],
        maxSize: 5 * 1024 * 1024, // 5MB
        fieldName: 'image',
      });
    }

    const playlist = await createUserPlaylist({
      name,
      description,
      image: image_file ? 'images/user-playlists/' + image_file.filename : null,
      user_id,
      song_ids: song_ids ? JSON.parse(song_ids) : [],
    });

    return res.status(OK_STATUS).json(playlist);
  }
);

export const renameUserPlaylistController = asyncWrapper(
  async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const user_id = req.user.id;

    // Validate inputs
    await Validator.isNumber(id, { integer: true, min: 1 });
    await Validator.validateNotNull({ name });
    await Validator.isText(name, { minLength: 2, maxLength: 100 });

    const playlist = await renameUserPlaylist({ id, name, user_id });

    return res.status(OK_STATUS).json(playlist);
  }
);

export const addSongsToUserPlaylistController = asyncWrapper(
  async (req, res) => {
    const { id } = req.params;
    const { song_ids } = req.body;
    const user_id = req.user.id;

    // Validate inputs
    await Validator.isNumber(id, { integer: true, min: 1 });
    await Validator.validateNotNull({ song_ids });
    await Validator.isArray(song_ids, { minLength: 1, maxLength: 100, arrayName: 'song_ids' });
    for (const song_id of song_ids) {
      await Validator.isNumber(song_id, { integer: true, min: 1 });
    }

    const playlist = await addSongsToUserPlaylist({ id, song_ids: song_ids, user_id });

    return res.status(OK_STATUS).json(playlist);
  }
);

export const copySystemPlaylistController = asyncWrapper(
  async (req, res) => {
    const { playlistId } = req.params;
    const user_id = req.user.id;

    // Validate inputs
    await Validator.isNumber(playlistId, { integer: true, min: 1 });

    const playlist = await copySystemPlaylist({ system_playlist_id: playlistId, user_id });

    return res.status(OK_STATUS).json(playlist);
  }
);

export const deleteUserPlaylistController = asyncWrapper(
  async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    // Validate inputs
    await Validator.isNumber(id, { integer: true, min: 1 });

    await deleteUserPlaylist({ id, user_id });

    return res.status(OK_STATUS).json({ message: 'Playlist deleted successfully' });
  }
);