// user_service.js
import prisma from '../lib/prisma.js';
import promiseAsyncWrapper from '../lib/wrappers/promise_async_wrapper.js';
import { ApiError } from '../lib/api_error.js';
import { BAD_REQUEST_STATUS } from '../lib/status_codes.js';
import { BAD_REQUEST_CODE } from '../lib/error_codes.js';

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
        settings: {
          music_settings: {
            data_saver: user.settings.data_saver,
            crossfade: user.settings.crossfade,
            gapless: user.settings.gapless,
            allow_explicit_content: user.settings.allow_explicit_content,
            show_unplayable_songs: user.settings.show_unplayable_songs,
            normalized_volume: user.settings.normalized_volume,
          },
          notification_settings: {
            email_notifications: user.settings.email_notifications,
            push_notifications: user.settings.push_notifications,
            new_releases: user.settings.new_releases,
            playlist_updates: user.settings.playlist_updates,
            artist_activity: user.settings.artist_activity,
          },
          main_settings: {
            language: user.settings.language,
            theme: user.settings.theme,
            time_zone: user.settings.time_zone,
            profile_visibility: user.settings.profile_visibility,
          },
        },
      };

      return resolve(mappedUser);
    }
  )
);

export const updateUser = async ({ id, payload }) => new Promise(
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

      let settingsData = {};
      if (settings) {
        if (settings.music_settings) {
          settingsData = { ...settingsData, ...settings.music_settings };
        }
        if (settings.notification_settings) {
          settingsData = { ...settingsData, ...settings.notification_settings };
        }
        if (settings.main_settings) {
          settingsData = { ...settingsData, ...settings.main_settings };
        }
      }

      const updatedUser = await prisma.users.update({
        where: { id: +id },
        data: {
          ...data,
          settings: Object.keys(settingsData).length > 0 ? { update: settingsData } : undefined,
        },
        include: { settings: true },
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
        settings: {
          music_settings: {
            data_saver: updatedUser.settings.data_saver,
            crossfade: updatedUser.settings.crossfade,
            gapless: updatedUser.settings.gapless,
            allow_explicit_content: updatedUser.settings.allow_explicit_content,
            show_unplayable_songs: updatedUser.settings.show_unplayable_songs,
            normalized_volume: updatedUser.settings.normalized_volume,
          },
          notification_settings: {
            email_notifications: updatedUser.settings.email_notifications,
            push_notifications: updatedUser.settings.push_notifications,
            new_releases: updatedUser.settings.new_releases,
            playlist_updates: updatedUser.settings.playlist_updates,
            artist_activity: updatedUser.settings.artist_activity,
          },
          main_settings: {
            language: updatedUser.settings.language,
            theme: updatedUser.settings.theme,
            time_zone: updatedUser.settings.time_zone,
            profile_visibility: updatedUser.settings.profile_visibility,
          },
        },
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
        settings: {
          music_settings: {
            data_saver: user.settings.data_saver,
            crossfade: user.settings.crossfade,
            gapless: user.settings.gapless,
            allow_explicit_content: user.settings.allow_explicit_content,
            show_unplayable_songs: user.settings.show_unplayable_songs,
            normalized_volume: user.settings.normalized_volume,
          },
          notification_settings: {
            email_notifications: user.settings.email_notifications,
            push_notifications: user.settings.push_notifications,
            new_releases: user.settings.new_releases,
            playlist_updates: user.settings.playlist_updates,
            artist_activity: user.settings.artist_activity,
          },
          main_settings: {
            language: user.settings.language,
            theme: user.settings.theme,
            time_zone: user.settings.time_zone,
            profile_visibility: user.settings.profile_visibility,
          },
        },
      }));

      return resolve(mappedUsers);
    }
  )
);
