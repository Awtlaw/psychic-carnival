import { reports } from '../../database/queries.js';
import asyncHandler from 'express-async-handler';
import { reportValidator } from '../../validators/reports.js';
import { validationResult } from 'express-validator';

export const createNewReport = [
  reportValidator,
  asyncHandler(async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
      return res
        .status(400)
        .json({ status: 'Validation Error', error: validationErrors.array() });
    if (req.body === undefined)
      return res.status(400).json({ status: 'error', message: 'Bad Request' });
    const { patientId, doctorId, diagnosis } = req.body;
    const newReport = await reports.createReport(
      patientId,
      doctorId,
      diagnosis,
    );
    res.status(201).json(newReport);
  }),
];

export const getReports = asyncHandler(async (req, res) => {
  const allReports = await reports.getAllReports();
  if (allReports.length === 0)
    return res
      .status(404)
      .json({ status: 'error', message: 'No record found!' });
  res.json([...allReports]);
});

export const getReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ status: 'error', message: 'Bad Request' });
  const patient = await reports.getReportById(id);
  if (!patient)
    return res
      .status(404)
      .json({ status: 'error', message: 'No record found!' });
  res.json(patient);
});
