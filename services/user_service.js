// user_service.js
import prisma from '../lib/prisma.js';
import promiseAsyncWrapper from '../lib/wrappers/promise_async_wrapper.js';
import { ApiError } from '../lib/api_error.js';
import { BAD_REQUEST_STATUS } from '../lib/status_codes.js';
import { BAD_REQUEST_CODE } from '../lib/error_codes.js';
import { GenreDTO } from '../mappers/genre.dto.js';
import { ArtistDTO } from '../mappers/artist.dto.js';

export const getUserById = async (id) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const user = await prisma.users.findUnique({
        where: { id: +id },
        include: { settings: true },
      });

      if (!user || user.deleted_at) {
        throw new ApiError('User not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      // Map to interface
      const mappedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        birth_date: user.birth_date.toISOString(),
        gender: user.gender,
        profile_picture: user.profile_picture,
        phone_number: user.phone_number,
        is_banned: user.is_banned,
        is_active: user.is_active,
        joined_at: user.joined_at.toISOString(),
        is_onboarded: user.is_onboarded
      };

      return resolve(mappedUser);
    }
  )
);

export const updateUserProfile = async ({ id, payload }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const { name, birth_date, gender, phone_number, profile_picture, is_banned, settings } = payload;

      const user = await prisma.users.findUnique({ where: { id: +id } });
      if (!user || user.deleted_at) {
        throw new ApiError('User not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      const data = {};
      if (name) data.name = name;
      if (birth_date) data.birth_date = birth_date;
      if (gender) data.gender = gender;
      if (phone_number) data.phone_number = phone_number;
      if (profile_picture) data.profile_picture = profile_picture;
      if (is_banned !== undefined) data.is_banned = is_banned;



      const updatedUser = await prisma.users.update({
        where: { id: +id },
        data: data,
      });

      // Map to interface
      const mappedUser = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        birth_date: updatedUser.birth_date.toISOString(),
        gender: updatedUser.gender,
        profile_picture: updatedUser.profile_picture,
        phone_number: updatedUser.phone_number,
        is_banned: updatedUser.is_banned,
        is_active: updatedUser.is_active,
        joined_at: updatedUser.joined_at.toISOString(),
        is_onboarded: user.is_onboarded
      };

      return resolve(mappedUser);
    }
  )
);

export const deleteUser = async (id) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const user = await prisma.users.findUnique({ where: { id: +id } });
      if (!user || user.deleted_at) {
        throw new ApiError('User not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      await prisma.users.update({
        where: { id: +id },
        data: { deleted_at: new Date(), is_active: false },
      });

      return resolve();
    }
  )
);


export const getAllUsers = async () => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const users = await prisma.users.findMany({
        where: { deleted_at: null },
        include: { settings: true },
      });

      // Map users to interface
      const mappedUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        birth_date: user.birth_date.toISOString(),
        gender: user.gender,
        profile_picture: user.profile_picture,
        phone_number: user.phone_number,
        is_banned: user.is_banned,
        is_active: user.is_active,
        joined_at: user.joined_at.toISOString(),
        is_onboarded: user.is_onboarded
      }));

      return resolve(mappedUsers);
    }
  )
);


export const deleteUserWithRelatedData = async (id) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const user = await prisma.users.findUnique({ where: { id: +id } });
      if (!user || user.deleted_at) {
        throw new ApiError('User not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      await prisma.user_artist_interests.deleteMany({ where: { user_id: +id } });
      await prisma.user_playlists.deleteMany({ where: { user_id: +id } });
      await prisma.users.update({
        where: { id: +id },
        data: { deleted_at: new Date(), is_active: false },
      });

      return resolve();
    }
  )
);


export const getUserGenrePreferences = async (userId) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const genres_interests = await prisma.user_genre_interests.findMany({
        where: { user_id: +userId },
        include: { genre: true }
      });

      const genres = genres_interests.map(pref => pref.genre);

      return resolve(
        GenreDTO.fromMany(
          genres
        )
      );
    }
  )
);

export const getUserArtistPreferences = async (userId) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const artistPrefs = await prisma.user_artist_interests.findMany({
        where: { user_id: +userId },
        include: { artist: true }
      });

      const artists = artistPrefs.map(pref => pref.artist);

      return resolve(
        ArtistDTO.fromMany(artists)
      );
    }
  )
);

export const updateUserGenrePreferences = async ({ user_id, preferences }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      // Delete existing preferences
      await prisma.user_genre_interests.deleteMany({
        where: { user_id: +user_id }
      });

      // Insert new preferences
      const prefsToCreate = preferences.map(genre_id => ({
        user_id: +user_id,
        genre_id: genre_id,
      }));

      await prisma.user_genre_interests.createMany({
        data: prefsToCreate
      });

      return resolve();
    }
  )
);

export const updateUserArtistPreferences = async ({ user_id, preferences }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      // Delete existing preferences
      await prisma.user_artist_interests.deleteMany({
        where: { user_id: +user_id }
      });

      // Insert new preferences
      const prefsToCreate = preferences.map(genre_id => ({
        user_id: +user_id,
        artist_id: genre_id,
      }));

      await prisma.user_artist_interests.createMany({
        data: prefsToCreate
      });

      return resolve();
    }
  )
);


export const getUserSettings = async (userId) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const user = await prisma.users.findUnique({
        where: { id: +userId },
        include: { settings: true },
      });

      if (!user || user.deleted_at) {
        throw new ApiError('User not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      const settings = {
        id: user.settings.id,
        data_saver: user.settings.data_saver,
        crossfade: user.settings.crossfade,
        gapless_playback: user.settings.gapless_playback,
        allow_explicit_content: user.settings.allow_explicit_content,
        show_unplayable_songs: user.settings.show_unplayable_songs,
        normalize_volume: user.settings.normalize_volume,
        shuffle_playback: user.settings.shuffle_playback,
        repeat_playback: user.settings.repeat_playback,
        play_next_song_automatically: user.settings.play_next_song_automatically
      };

      return resolve(settings);
    }
  )
);

export const updateUserSettings = async ({ userId, settings }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const user = await prisma.users.findUnique({
        where: { id: +userId }
      });

      if (!user || user.deleted_at) {
        throw new ApiError('User not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      const updatedSettings = await prisma.user_settings.update({
        where: {
          user_id: +userId
        },
        data: {
          data_saver: settings.data_saver,
          crossfade: settings.crossfade,
          gapless_playback: settings.gapless_playback,
          allow_explicit_content: settings.allow_explicit_content,
          show_unplayable_songs: settings.show_unplayable_songs,
          normalize_volume: settings.normalize_volume,
          shuffle_playback: settings.shuffle_playback,
          repeat_playback: settings.repeat_playback,
          play_next_song_automatically: settings.play_next_song_automatically
        }
      });

      const mappedSettings = {
        id: updatedSettings.id,
        data_saver: updatedSettings.data_saver,
        crossfade: updatedSettings.crossfade,
        gapless_playback: updatedSettings.gapless_playback,
        allow_explicit_content: updatedSettings.allow_explicit_content,
        show_unplayable_songs: updatedSettings.show_unplayable_songs,
        normalize_volume: updatedSettings.normalize_volume,
        shuffle_playback: updatedSettings.shuffle_playback,
        repeat_playback: updatedSettings.repeat_playback,
        play_next_song_automatically: updatedSettings.play_next_song_automatically
      };

      return resolve(mappedSettings);
    }
  )
);

export const completeOnboarding = async ({ user_id, artist_ids, genre_ids }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      // Validate user exists
      const user = await prisma.users.findUnique({ 
        where: { id: +user_id }
      });

      if (!user || user.deleted_at) {
        throw new ApiError('User not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      // Create genre preferences
      const genrePrefs = genre_ids.map(genre_id => ({
        user_id: +user_id,
        genre_id: +genre_id,
      }));

      await prisma.user_genre_interests.createMany({
        data: genrePrefs
      });

      // Create artist preferences 
      const artistPrefs = artist_ids.map(artist_id => ({
        user_id: +user_id,
        artist_id: +artist_id,
      }));

      await prisma.user_artist_interests.createMany({
        data: artistPrefs
      });

      await prisma.users.update({
        where: {
          id: +user_id
        },

        data: {
          is_onboarded: true
        }
      })

      return resolve();
    }
  )
);



export const deleteUserAccount = async (userId) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      // Check if user exists
      const user = await prisma.users.findUnique({ 
        where: { id: +userId }
      });

      if (!user || user.deleted_at) {
        throw new ApiError('User not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      prisma.users.update({
        where: { id: +userId },
        data: { 
          deleted_at: new Date(),
          is_active: false,
          email: `deleted_${userId}_${user.email}`, // Prevent email reuse
          phone_number: null,
          profile_picture: null
        }
      })

      return resolve();
    }
  )
);

export const restoreUserAccount = async (userId) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      // Check if user exists and is deleted
      const user = await prisma.users.findUnique({ 
        where: { id: +userId }
      });

      if (!user) {
        throw new ApiError('User not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      if (!user.deleted_at) {
        throw new ApiError('User account is already active', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      // Extract original email by removing the deleted_ prefix
      const emailParts = user.email.split('_');
      const originalEmail = emailParts.slice(2).join('_');

      // Restore user account
      const restoredUser = await prisma.users.update({
        where: { id: +userId },
        data: {
          deleted_at: null,
          is_active: true,
          email: originalEmail
        },
        include: { settings: true }
      });

      // Map to interface
      const mappedUser = {
        id: restoredUser.id,
        name: restoredUser.name,
        email: restoredUser.email,
        birth_date: restoredUser.birth_date.toISOString(),
        gender: restoredUser.gender,
        profile_picture: restoredUser.profile_picture,
        phone_number: restoredUser.phone_number,
        is_banned: restoredUser.is_banned,
        is_active: restoredUser.is_active,
        joined_at: restoredUser.joined_at.toISOString()
      };

      return resolve(mappedUser);
    }
  )
);
