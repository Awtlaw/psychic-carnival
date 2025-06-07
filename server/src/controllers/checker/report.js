import { reports } from '../../database/queries';
import asyncHandler from 'express-async-handler';

export const createNewReport = asyncHandler(async (req, res) => {
  if (req.body === undefined)
    return res.status(400).json({ status: 'error', message: 'Bad Request' });
  const { patientId, doctorId, diagnois } = req.body;
  const newReport = await reports.createReport(patientId, doctorId, diagnois);
  res.status(201).json(newReport);
});

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
  res.json(patient);
});
