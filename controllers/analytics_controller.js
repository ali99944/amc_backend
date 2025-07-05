// analytics_controller.js
import { OK_STATUS } from '../lib/status_codes.js';
import Validator from '../lib/validator.js';
import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import { getSongPlaysAnalytics, getUserActivityAnalytics, getRetentionAnalytics } from '../services/analytics_service.js';

export const getSongPlaysAnalyticsController = asyncWrapper(
  async (req, res) => {
    const { start_date, end_date, group_by, genre_id, artist_id } = req.query;

    // Validate query params
    if (start_date) await Validator.isDate(start_date);
    if (end_date) await Validator.isDate(end_date);
    if (group_by) await Validator.isEnum(group_by, ['day', 'week', 'month'], 'Invalid group_by value');
    if (genre_id) await Validator.isNumber(genre_id, { integer: true, min: 1 });
    if (artist_id) await Validator.isNumber(artist_id, { integer: true, min: 1 });

    const analytics = await getSongPlaysAnalytics({
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
      group_by: group_by || 'day',
      genre_id: genre_id ? +genre_id : undefined,
      artist_id: artist_id ? +artist_id : undefined,
    });

    return res.status(OK_STATUS).json(analytics);
  }
);

export const getUserActivityAnalyticsController = asyncWrapper(
  async (req, res) => {
    const { start_date, end_date, group_by, activity_type } = req.query;

    // Validate query params
    if (start_date) await Validator.isDate(start_date);
    if (end_date) await Validator.isDate(end_date);
    if (group_by) await Validator.isEnum(group_by, ['day', 'week', 'month'], 'Invalid group_by value');
    if (activity_type) await Validator.isEnum(activity_type, ['signups', 'logins', 'playlist_creations'], 'Invalid activity_type value');

    const analytics = await getUserActivityAnalytics({
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
      group_by: group_by || 'day',
      activity_type: activity_type || 'signups',
    });

    return res.status(OK_STATUS).json(analytics);
  }
);

export const getRetentionAnalyticsController = asyncWrapper(
  async (req, res) => {
    const { start_date, end_date, period } = req.query;

    // Validate query params
    if (start_date) await Validator.isDate(start_date);
    if (end_date) await Validator.isDate(end_date);
    if (period) await Validator.isEnum(period, ['7d', '30d', '90d'], 'Invalid period value');

    const analytics = await getRetentionAnalytics({
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
      period: period || '30d',
    });

    return res.status(OK_STATUS).json(analytics);
  }
);
