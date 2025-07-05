import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import { getReports, createReport, getReport } from '../services/report_service.js';
import { OK_STATUS, CREATED_STATUS } from '../lib/status_codes.js';

export const getReportsController = asyncWrapper(async (req, res) => {
  const reports = await getReports();
  return res.status(OK_STATUS).json(reports);
});

export const createReportController = asyncWrapper(async (req, res) => {
  const reportData = req.body;
  const report = await createReport(reportData);
  return res.status(CREATED_STATUS).json(report);
});

export const getReportController = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const report = await getReport(parseInt(id));
  return res.status(OK_STATUS).json(report);
});