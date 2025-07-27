// user_controller.js

import {  OK_STATUS } from '../lib/status_codes.js';
import Validator from '../lib/validator.js';
import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import { updateUserProfile, getUserById, deleteUser, getAllUsers, deleteUserWithRelatedData, getUserGenrePreferences, getUserArtistPreferences, updateUserGenrePreferences, updateUserArtistPreferences, getUserSettings, updateUserSettings, completeOnboarding, deleteUserAccount, restoreUserAccount } from '../services/user_service.js';

export const getCurrentUserController = asyncWrapper(
  async (req, res) => {
    const user = await getUserById(req.user.id);
    return res.status(OK_STATUS).json(user);
  }
);

export const updateUserProfileController = asyncWrapper(
  async (req, res) => {
    const id = req.user.id; 
    const { name } = req.body;
    const profile_picture = req.file;

    console.log(req.body);
    console.log(profile_picture);
    

    // Validate inputs
    await Validator.isNumber(id, { integer: true, min: 1 });
    if (name) await Validator.isText(name, { minLength: 2, maxLength: 100 });

    const updatedUser = await updateUserProfile({
      id,
      payload: {
        name,
        profile_picture: profile_picture ? 'images/profiles/' + profile_picture.filename : undefined,
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


export const deleteUserWithRelatedDataController = asyncWrapper(
  async (req, res) => {
    const { id } = req.params;
    await deleteUserWithRelatedData(id);
    return res.status(OK_STATUS).json({ message: 'User and related data deleted successfully' });
  }
);



export const getUserGenrePreferencesController = asyncWrapper(
  async (req, res) => {
    const userId = req.params.id || req.user.id;
    const preferences = await getUserGenrePreferences(userId);
    console.log(preferences);
    
    return res.status(OK_STATUS).json(preferences);
  }
);

export const getUserArtistPreferencesController = asyncWrapper(
  async (req, res) => {
    const userId = req.params.id || req.user.id;
    const preferences = await getUserArtistPreferences(userId);
    return res.status(OK_STATUS).json(preferences);
  }
);

export const updateUserGenrePreferencesController = asyncWrapper(
  async (req, res) => {
    const user_id = req.user.id;
    const { preferences } = req.body;

    // Validate preferences array
    await Validator.isArray(preferences, { minLength: 1 });

    await updateUserGenrePreferences({ user_id, preferences });
    return res.status(OK_STATUS).json({ message: 'Genre preferences updated successfully' });
  }
);

export const updateUserArtistPreferencesController = asyncWrapper(
  async (req, res) => {
    const user_id = req.user.id;
    const { preferences } = req.body;

    // Validate preferences array
    await Validator.isArray(preferences, { minLength: 1 });

    await updateUserArtistPreferences({ user_id, preferences });
    return res.status(OK_STATUS).json({ message: 'Artist preferences updated successfully' });
  }
);


export const getUserSettingsController = asyncWrapper(
  async (req, res) => {
    const userId = req.params.id || req.user.id;
    const settings = await getUserSettings(userId);
    
    return res.status(OK_STATUS).json(settings);
  }
);

export const updateUserSettingsController = asyncWrapper(
  async (req, res) => {
    const userId = req.user.id;
    
    const {
      data_saver,
      crossfade,
      gapless_playback,
      allow_explicit_content,
      show_unplayable_songs,
      normalize_volume,
      shuffle_playback,
      repeat_playback,
      play_next_song_automatically
    } = req.body;

    // Validate all boolean settings
    const booleanSettings = [
      data_saver,
      crossfade, 
      gapless_playback,
      allow_explicit_content,
      show_unplayable_songs,
      normalize_volume,
      shuffle_playback,
      repeat_playback,
      play_next_song_automatically
    ];

    for (const setting of booleanSettings) {
      if (setting !== undefined) {
        await Validator.isEnum(setting, [true, false], 'Setting must be a boolean');
      }
    }

    const settings = {
      data_saver,
      crossfade,
      gapless_playback,
      allow_explicit_content,
      show_unplayable_songs,
      normalize_volume,
      shuffle_playback,
      repeat_playback,
      play_next_song_automatically
    };

    const updatedSettings = await updateUserSettings({ userId, settings });
    return res.status(OK_STATUS).json(updatedSettings);
  }
);


export const completeOnboardingController = asyncWrapper(
  async (req, res) => {
    const user_id = req.user.id;
    const { artist_ids, genre_ids } = req.body;

    // Validate arrays
    // await Validator.isArray(artist_ids, { minLength: 1 });
    // await Validator.isArray(genre_ids, { minLength: 1 });

    // Validate each ID is a positive integer
    // for (const id of [...artist_ids, ...genre_ids]) {
    //   await Validator.isNumber(id, { integer: true, min: 1 });
    // }

    await completeOnboarding({ user_id, artist_ids, genre_ids });
    return res.status(OK_STATUS).json({ message: 'Onboarding completed successfully' });
  }
);

export const deleteUserAccountController = asyncWrapper(
  async (req, res) => {
    const userId = req.params.id || req.user.id;
    
    // Validate user ID
    // await Validator.isNumber(userId, { integer: true, min: 1 });

    await deleteUserAccount(userId);
    return res.status(OK_STATUS).json({ message: 'Account deleted successfully' });
  }
);

export const restoreUserAccountController = asyncWrapper(
  async (req, res) => {
    const { id } = req.params;

    // Validate user ID
    // await Validator.isNumber(id, { integer: true, min: 1 });

    const restoredUser = await restoreUserAccount(id);
    return res.status(OK_STATUS).json(restoredUser);
  }
);
