import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import { getSettings, getSettingsByKey, overrideSettings, updateSettings } from '../services/settings_service.js';
import { OK_STATUS } from '../lib/status_codes.js';

export const getSettingsController = asyncWrapper(async (req, res) => {
  const settings = await getSettings();
  return res.status(OK_STATUS).json(settings);
});

export const getSettingsByKeyController = asyncWrapper(async (req, res) => {
  const { key } = req.params;
  const settings = await getSettingsByKey(key);
  return res.status(OK_STATUS).json(settings);
});

export const updateSettingsController = asyncWrapper(async (req, res) => {
  const { key } = req.params;
  const data = req.body;
  await updateSettings(key, data);
  return res.status(OK_STATUS).json({ message: `Settings for ${key} updated` });
});

export const overrideSettingsController = asyncWrapper(async (req, res) => {
  const { body } = req;
  await overrideSettings(body);
  return res.status(OK_STATUS).json({ message: 'Settings overridden' });
});
