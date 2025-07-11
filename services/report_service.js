import prisma from '../lib/prisma.js';
import promiseAsyncWrapper from '../lib/wrappers/promise_async_wrapper.js';
import { ApiError } from '../lib/api_error.js';
import { NOT_FOUND_STATUS, BAD_REQUEST_STATUS } from '../lib/status_codes.js';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BAD_REQUEST_CODE, NOT_FOUND_CODE } from '../lib/error_codes.js';
import { fileURLToPath } from "url";
import { extractReportData } from '../lib/report_data_extractor.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


export const getReports = () => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const reports = await prisma.reports.findMany({
      orderBy: { created_at: 'desc' },
    });
    resolve(reports.map(report => ({
      ...report,
      created_at: report.created_at.toISOString(),
      report_file_size: (report.report_file_size / 1024 / 1024).toFixed(1) + ' MB',
    })));
  })
);

export const createReport = (reportData) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const { report_name, description, report_type, start_date, end_date } = reportData;
    if (!report_name || !report_type) {
      throw new ApiError('Report name and type are required', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }

    // Read Handlebars template
    const templatePath = path.join(__dirname, `../templates/${report_type}.html`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent);

    const data = await extractReportData(report_type)

    // Generate HTML
    const html = template(data);

    // Generate PDF with Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfPath = path.join(__dirname, `../public/reports/report-${uuidv4()}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: 'A3',
      printBackground: true,
      // margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
    });
    await browser.close();

    // Get file size
    const stats = await fs.stat(pdfPath);
    const fileSize = stats.size;

    // Save report to database
    const report = await prisma.reports.create({
      data: {
        report_name: report_name,
        report_type: report_type,
        description: description,
        start_date: start_date,
        end_date: end_date,
        generated_report_size: 0,
        generated_report_url: `reports/${path.basename(pdfPath)}`
      },
    });

    resolve({
      ...report,
      created_at: report.created_at.toISOString(),
      report_file_size: (fileSize / 1024 / 1024).toFixed(1) + ' MB',
    });
  })
);

export const getReport = (id) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const report = await prisma.reports.findUnique({ where: { id } });
    if (!report) {
      throw new ApiError('Report not found', NOT_FOUND_CODE, NOT_FOUND_STATUS);
    }
    resolve({
      ...report,
      created_at: report.created_at.toISOString(),
      report_file_size: (report.report_file_size / 1024 / 1024).toFixed(1) + ' MB',
    });
  })
);

export const deleteReport = (id) => new Promise(
  promiseAsyncWrapper(async (resolve, reject) => {
    try {
      await prisma.reports.delete({ where: { id } });
      resolve({ message: 'Report deleted successfully' });
    } catch (error) {
      reject(new ApiError('Failed to delete report', BAD_REQUEST_CODE, BAD_REQUEST_STATUS));
    }
  })
);

