import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApiError } from '../lib/api_error.js';
import { BAD_REQUEST_STATUS } from '../lib/status_codes.js';
import promiseAsyncWrapper from '../lib/wrappers/promise_async_wrapper.js';
import { BAD_REQUEST_CODE } from '../lib/error_codes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SETTINGS_PATH = path.join(__dirname, '../lib/app_settings.json');

const validKeys = ['general', 'audio', 'streaming', 'notifications', 'recommendations'];

export const getSettings = () => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const data = await fs.readFile(SETTINGS_PATH, 'utf-8');
    resolve(JSON.parse(data));
  })
);

export const getSettingsByKey = (key) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    if (!validKeys.includes(key)) {
      throw new ApiError(`Invalid settings key: ${key}`, BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }
    const data = await fs.readFile(SETTINGS_PATH, 'utf-8');
    const settings = JSON.parse(data);
    resolve(settings[key]);
  })
);

export const updateSettings = (key, data) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    if (!validKeys.includes(key)) {
      throw new ApiError(`Invalid settings key: ${key}`, BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }
    const currentSettings = JSON.parse(await fs.readFile(SETTINGS_PATH, 'utf-8'));
    currentSettings[key] = { ...currentSettings[key], ...data };
    await fs.writeFile(SETTINGS_PATH, JSON.stringify(currentSettings, null, 2));
    resolve();
  })
);

export const overrideSettings = (data) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    await fs.writeFile(SETTINGS_PATH, JSON.stringify(data, null, 2));
    resolve();
  })
);
