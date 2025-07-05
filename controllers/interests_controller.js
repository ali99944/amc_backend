import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import Validator from '../lib/validator.js';
import { ApiError } from '../lib/api_error.js';
import { OK_STATUS } from '../lib/status_codes.js';
import {
  addGenreInterests,
  removeGenreInterest,
  getGenreInterests,
  addArtistInterests,
  removeArtistInterest,
  getArtistInterests,
} from '../services/interests_service.js';
import { BAD_REQUEST_CODE } from '../lib/error_codes.js';

export const addGenreInterestsController = asyncWrapper(async (req, res) => {
  const { genre_ids } = req.body;
  const user_id = req.user.id;

  if (!Array.isArray(genre_ids)) {
    throw new ApiError('genre_ids must be an array', BAD_REQUEST_CODE, OK_STATUS);
  }
  for (const id of genre_ids) {
    await Validator.isNumber(id, { integer: true, min: 1 });
  }

  await addGenreInterests({ user_id, genre_ids: genre_ids.map(Number) });

  return res.status(OK_STATUS).json({ message: 'Genre interests added' });
});

export const removeGenreInterestController = asyncWrapper(async (req, res) => {
  const { genre_id } = req.params;
  const user_id = req.user.id;

  await Validator.isNumber(genre_id, { integer: true, min: 1 });

  await removeGenreInterest({ user_id, genre_id: Number(genre_id) });

  return res.status(OK_STATUS).json({ message: 'Genre interest removed' });
});

export const getGenreInterestsController = asyncWrapper(async (req, res) => {
  const { limit, offset } = req.query;
  const user_id = req.user.id;

  if (limit) await Validator.isNumber(limit, { integer: true, min: 1, max: 50 });
  if (offset) await Validator.isNumber(offset, { integer: true, min: 0 });

  const genres = await getGenreInterests({
    user_id,
    limit: limit ? Number(limit) : 10,
    offset: offset ? Number(offset) : 0,
  });

  return res.status(OK_STATUS).json(genres);
});

export const addArtistInterestsController = asyncWrapper(async (req, res) => {
  const { artist_ids } = req.body;
  const user_id = req.user.id;

  if (!Array.isArray(artist_ids)) {
    throw new ApiError('artist_ids must be an array', BAD_REQUEST_CODE, OK_STATUS);
  }
  for (const id of artist_ids) {
    await Validator.isNumber(id, { integer: true, min: 1 });
  }

  await addArtistInterests({ user_id, artist_ids: artist_ids.map(Number) });

  return res.status(OK_STATUS).json({ message: 'Artist interests added' });
});

export const removeArtistInterestController = asyncWrapper(async (req, res) => {
  const { artist_id } = req.params;
  const user_id = req.user.id;

  await Validator.isNumber(artist_id, { integer: true, min: 1 });

  await removeArtistInterest({ user_id, artist_id: Number(artist_id) });

  return res.status(OK_STATUS).json({ message: 'Artist interest removed' });
});

export const getArtistInterestsController = asyncWrapper(async (req, res) => {
  const { limit, offset } = req.query;
  const user_id = req.user.id;

  if (limit) await Validator.isNumber(limit, { integer: true, min: 1, max: 50 });
  if (offset) await Validator.isNumber(offset, { integer: true, min: 0 });

  const artists = await getArtistInterests({
    user_id,
    limit: limit ? Number(limit) : 10,
    offset: offset ? Number(offset) : 0,
  });

  return res.status(OK_STATUS).json(artists);
});