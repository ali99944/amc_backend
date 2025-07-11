import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import { getReports, createReport, getReport, deleteReport } from '../services/report_service.js';
import { OK_STATUS, CREATED_STATUS } from '../lib/status_codes.js';
import Validator from '../lib/validator.js';

export const getReportsController = asyncWrapper(async (req, res) => {
  const reports = await getReports();
  return res.status(OK_STATUS).json(reports);
});

export const createReportController = asyncWrapper(async (req, res) => {
  const { report_type, report_name, description, start_date, end_date } = req.body;
  console.log(req.body);
  
  
  await Validator.validateNotNull({
    report_type, report_name, start_date, end_date
  })

  console.log('am hereeee');
  

  const report = await createReport({ report_type, report_name, description, start_date, end_date });
  return res.status(CREATED_STATUS).json(report);
});

export const getReportController = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const report = await getReport(parseInt(id));
  return res.status(OK_STATUS).json(report);
});


export const deleteReportController = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  await deleteReport(parseInt(id));
  return res.status(OK_STATUS).json({ message: 'Report deleted successfully' });
});
