import { appointments } from '../../database/queries';
import asyncHandler from 'express-async-handler';
import { appointmentValidator } from '../../middlewares/validators/appointments';
import { validationResult } from 'express-validator';

export const bookNewAppointment = [
  appointmentValidator,
  asyncHandler(async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
      return res
        .status(400)
        .json({ status: 'Validation Error', error: validationErrors.array() });
    if (req.body === undefined)
      return res.status(400).json({ status: 'error', message: 'Bad Request' });
    const { patientId, message } = req.body;
    const newAppointment = await appointments.bookAppointment(
      patientId,
      message,
    );
    res.status(201).json(newAppointment);
  }),
];

export const getPendingAppointments = asyncHandler(async (req, res) => {
  const pendingAppointments = await appointments.findPendingAppointments();
  res.json([...pendingAppointments]);
});

export const getFulfilledAppointments = asyncHandler(async (req, res) => {
  const fulfilledAppointments = await appointments.findFulfilledAppointments();
  res.json([...fulfilledAppointments]);
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ status: 'error', message: 'Bad Request' });
  await appointments.cancelAppointment(id);
  res.json('Operation Successful');
});

export const fulfillAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ status: 'error', message: 'Bad Request' });
  await appointments.fulfillAppointment(id);
  res.json('Operation Successful');
});
