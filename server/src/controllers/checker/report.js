import { reports } from '../../database/queries.js';
import asyncHandler from 'express-async-handler';
import { reportValidator } from '../../validators/reports.js';
import { validationResult } from 'express-validator';

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

    const { patientId, doctorId, diagnosis: data } = req.body;

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

// ✅ NEW: Update Doctor’s Notes
export const updateReportNotes = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  if (!notes || notes.trim() === '') {
    return res.status(400).json({
      message: 'Notes are required',
      success: false,
    });
  }

  const updatedReport = await reports.updateNotes(id, notes);

  if (!updatedReport)
    return res.status(404).json({
      message: 'Report not found!',
      success: false,
    });

  res.json({
    message: 'Notes updated successfully',
    success: true,
    data: updatedReport,
  });
});
// ✅ NEW: Mark Report as Fulfilled
export const fulfillReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedReport = await reports.fulfillReport(id); // call query function

  if (!updatedReport) {
    return res.status(404).json({
      message: 'Report not found!',
      success: false,
    });
  }

  res.json({
    message: 'Report marked as fulfilled',
    success: true,
    data: updatedReport,
  });
});
