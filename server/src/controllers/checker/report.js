import { reports } from '../../database/queries.js';
import asyncHandler from 'express-async-handler';
import { reportValidator } from '../../validators/reports.js';
import { validationResult } from 'express-validator';
import axios from 'axios';

export const createNewReport = [
  reportValidator,
  asyncHandler(async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
      return res.status(400).json({
        message: 'Validation error',
        success: false,
        error: validationErrors.array(),
      });

    const { patientId, doctorId, diagnosis } = req.body;
    const { data } = await axios.post(
      `${process.env.APP_BASE}/report/diagnosis`,
      { query: diagnosis },
      { headers: { 'Content-Type': 'application/json' } },
    );

    const newReport = await reports.createReport(
      patientId,
      doctorId,
      JSON.stringify(data),
    );
    res.status(201).json({
      message: 'Report creation successful',
      success: true,
      data: newReport,
    });
  }),
];

export const getReports = asyncHandler(async (req, res) => {
  const allReports = await reports.getAllReports();

  if (allReports.length === 0)
    return res
      .status(404)
      .json({ message: 'No record found!', success: 'false' });

  res.json({
    message: 'Retrieved reports',
    success: true,
    data: [...allReports],
  });
});

export const getReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: 'Bad Request', success: false });

  const patient = await reports.getReportById(id);
  if (!patient)
    return res
      .status(404)
      .json({ message: 'No record found!', success: false });

  res.json({ message: 'Retrieved report', success: true, data: patient });
});
