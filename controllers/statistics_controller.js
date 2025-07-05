// statistics_controller.js
import { OK_STATUS } from '../lib/status_codes.js';
import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import { getOverviewStatistics } from '../services/statistics_service.js';

export const getOverviewStatisticsController = asyncWrapper(
  async (req, res) => {
    const stats = await getOverviewStatistics();
    return res.status(OK_STATUS).json(stats);
  }
);