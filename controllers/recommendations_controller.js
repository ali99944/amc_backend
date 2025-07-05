// recommendations_controller.js

import { OK_STATUS } from '../lib/status_codes.js';
import Validator from '../lib/validator.js';
import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import { getSongRecommendations, getPlaylistRecommendations } from '../services/recommendations_service.js';

export const getSongRecommendationsController = asyncWrapper(
  async (req, res) => {
    const { limit, offset } = req.query;
    const user_id = req.user.id;

    // Validate query params
    if (limit) await Validator.isNumber(limit, { integer: true, min: 1, max: 50 });
    if (offset) await Validator.isNumber(offset, { integer: true, min: 0 });

    const songs = await getSongRecommendations({
      user_id,
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
    });

    return res.status(OK_STATUS).json(songs);
  }
);

export const getPlaylistRecommendationsController = asyncWrapper(
  async (req, res) => {
    const { limit, offset } = req.query;
    const user_id = req.user.id;

    // Validate query params
    if (limit) await Validator.isNumber(limit, { integer: true, min: 1, max: 50 });
    if (offset) await Validator.isNumber(offset, { integer: true, min: 0 });

    const playlists = await getPlaylistRecommendations({
      user_id,
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
    });

    return res.status(OK_STATUS).json(playlists);
  }
);