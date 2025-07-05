// user_controller.js

import {  OK_STATUS } from '../lib/status_codes.js';
import Validator from '../lib/validator.js';
import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import { updateUser, getUserById, deleteUser, getAllUsers } from '../services/user_service.js';

export const getCurrentUserController = asyncWrapper(
  async (req, res) => {
    const user = await getUserById(req.user.id);
    return res.status(OK_STATUS).json(user);
  }
);

export const updateUserController = asyncWrapper(
  async (req, res) => {
    const { id } = req.params || { id: req.user.id }; // Support both user and manager updates
    const { name, birth_date, gender, phone_number, settings } = req.body;
    const profile_picture = req.file;
    const is_banned = req.body.is_banned !== undefined ? JSON.parse(req.body.is_banned) : undefined;

    // Validate inputs
    await Validator.isNumber(id, { integer: true, min: 1 });
    if (name) await Validator.isText(name, { minLength: 2, maxLength: 100 });
    if (birth_date) await Validator.isDate(birth_date, { maxDate: new Date().toISOString() });
    if (gender) await Validator.isEnum(gender, ['male', 'female', 'other'], 'Invalid gender');
    if (phone_number) await Validator.isText(phone_number, { pattern: /^\+?[1-9]\d{1,14}$/, errorMessage: 'Invalid phone number' });
    if (is_banned !== undefined) await Validator.isEnum(is_banned, [true, false], 'is_banned must be a boolean');
    if (settings) {
      const parsedSettings = JSON.parse(settings || '{}');
      if (parsedSettings.music_settings) {
        for (const key of ['data_saver', 'crossfade', 'gapless', 'allow_explicit_content', 'show_unplayable_songs', 'normalized_volume']) {
          if (parsedSettings.music_settings[key] !== undefined) {
            await Validator.isEnum(parsedSettings.music_settings[key], [true, false], `${key} must be a boolean`);
          }
        }
      }
      if (parsedSettings.notification_settings) {
        for (const key of ['email_notifications', 'push_notifications', 'new_releases', 'playlist_updates', 'artist_activity']) {
          if (parsedSettings.notification_settings[key] !== undefined) {
            await Validator.isEnum(parsedSettings.notification_settings[key], [true, false], `${key} must be a boolean`);
          }
        }
      }
      if (parsedSettings.main_settings) {
        if (parsedSettings.main_settings.language) await Validator.isText(parsedSettings.main_settings.language, { minLength: 2, maxLength: 10 });
        if (parsedSettings.main_settings.theme) await Validator.isEnum(parsedSettings.main_settings.theme, ['light', 'dark', 'system'], 'Invalid theme');
        if (parsedSettings.main_settings.time_zone) await Validator.isText(parsedSettings.main_settings.time_zone, { minLength: 1, maxLength: 50 });
        if (parsedSettings.main_settings.profile_visibility) await Validator.isEnum(parsedSettings.main_settings.profile_visibility, ['public', 'private'], 'Invalid profile visibility');
      }
    }
    if (profile_picture) {
      await Validator.validateFile(profile_picture, {
        allowedTypes: ['image/jpeg', 'image/png'],
        maxSize: 5 * 1024 * 1024, // 5MB
        fieldName: 'profile_picture',
      });
    }

    const updatedUser = await updateUser({
      id,
      payload: {
        name,
        birth_date: birth_date ? new Date(birth_date) : undefined,
        gender,
        phone_number,
        profile_picture: profile_picture ? 'images/profiles/' + profile_picture.filename : undefined,
        is_banned,
        settings: settings ? JSON.parse(settings) : undefined,
      },
    });

    return res.status(OK_STATUS).json(updatedUser);
  }
);

export const deleteUserController = asyncWrapper(
  async (req, res) => {
    const userId = req.user.id;
    await deleteUser(userId);
    return res.status(OK_STATUS).json({ message: 'Account deleted successfully' });
  }
);


export const getAllUsersController = asyncWrapper(
  async (req, res) => {
    const users = await getAllUsers();
    return res.status(OK_STATUS).json(users);
  }
);
