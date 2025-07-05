import prisma from '../lib/prisma.js';
import { ApiError } from '../lib/api_error.js';
import {  NOT_FOUND_STATUS, NOT_AUTHORIZED_STATUS } from '../lib/status_codes.js';
import promiseAsyncWrapper from '../lib/wrappers/promise_async_wrapper.js';
import { AUTH_ERROR_CODE, NOT_FOUND_CODE } from '../lib/error_codes.js';

export const getUserSettings = (user_id, user, manager) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    // Check if user or manager is authorized
    if (!user && !manager) {
      throw new ApiError('Unauthorized: User or manager token required', AUTH_ERROR_CODE, NOT_AUTHORIZED_STATUS);
    }
    if (user && user.id !== user_id && !manager) {
      throw new ApiError('Unauthorized: Cannot access another user\'s settings', AUTH_ERROR_CODE, NOT_AUTHORIZED_STATUS);
    }

    const settings = await prisma.user_settings.findUnique({
      where: { user_id },
    });

    if (!settings) {
      throw new ApiError(`Settings for user ID ${user_id} not found`, NOT_FOUND_CODE, NOT_FOUND_STATUS);
    }

    resolve({
      id: settings.id,
      data_saver: settings.data_saver,
      crossfade: settings.crossfade,
      gapless_playback: settings.gapless_playback,
      allow_explicit_content: settings.allow_explicit_content,
      show_unplayable_songs: settings.show_unplayable_songs,
      normalize_volume: settings.normalize_volume,
      shuffle_playback: settings.shuffle_playback,
      repeat_playback: settings.repeat_playback,
      play_next_song_automatically: settings.play_next_song_automatically,
      created_at: settings.created_at.toISOString(),
      updated_at: settings.updated_at.toISOString(),
    });
  })
);

export const updateUserSettings = (user_id, data, user, manager) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    // Check if user or manager is authorized
    if (!user && !manager) {
      throw new ApiError('Unauthorized: User or manager token required', AUTH_ERROR_CODE, NOT_AUTHORIZED_STATUS);
    }
    if (user && user.id !== user_id && !manager) {
      throw new ApiError('Unauthorized: Cannot update another user\'s settings', AUTH_ERROR_CODE, NOT_AUTHORIZED_STATUS);
    }

    const settings = await prisma.user_settings.findUnique({
      where: { user_id },
    });

    if (!settings) {
      throw new ApiError(`Settings for user ID ${user_id} not found`, NOT_FOUND_CODE, NOT_FOUND_STATUS);
    }

    const updated_settings = await prisma.user_settings.update({
      where: { user_id },
      data: {
        data_saver: data.data_saver ?? settings.data_saver,
        crossfade: data.crossfade ?? settings.crossfade,
        gapless_playback: data.gapless_playback ?? settings.gapless_playback,
        allow_explicit_content: data.allow_explicit_content ?? settings.allow_explicit_content,
        show_unplayable_songs: data.show_unplayable_songs ?? settings.show_unplayable_songs,
        normalize_volume: data.normalize_volume ?? settings.normalize_volume,
        shuffle_playback: data.shuffle_playback ?? settings.shuffle_playback,
        repeat_playback: data.repeat_playback ?? settings.repeat_playback,
        play_next_song_automatically: data.play_next_song_automatically ?? settings.play_next_song_automatically,
      },
    });

    resolve(updated_settings);
  })
);
