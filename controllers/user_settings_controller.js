import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import { getUserSettings, updateUserSettings } from '../services/user_settings_service.js';
import { OK_STATUS } from '../lib/status_codes.js';

export const getUserSettingsController = asyncWrapper(async (req, res) => {
  const settings = await getUserSettings(req.user.id, req.user, req.manager);
  return res.status(OK_STATUS).json(settings);
});

export const updateUserSettingsController = asyncWrapper(async (req, res) => {
  const data = req.body;
  const settings = await updateUserSettings(req.user.id, data, req.user, req.manager);
  return res.status(OK_STATUS).json(settings);
});