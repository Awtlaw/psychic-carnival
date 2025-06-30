import { appointments } from '../../database/queries.js';
import asyncHandler from 'express-async-handler';
import { appointmentValidator } from '../../validators/appointments.js';
import { validationResult } from 'express-validator';
import { sendBookingMail } from '../../utils/mail.js';

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
    sendBookingMail(
      message.recipient,
      message.fullName,
      message.date,
      message.period,
      message.reason,
    );
  }),
];

export const getPendingAppointments = asyncHandler(async (req, res) => {
  const pendingAppointments = await appointments.findPendingAppointments();
  if (pendingAppointments.length < 1)
    return res.status(404).json({
      status: 'error',
      message: 'No pending appointment found',
    });
  res.json([...pendingAppointments]);
});

export const getFulfilledAppointments = asyncHandler(async (req, res) => {
  const fulfilledAppointments = await appointments.findFulfilledAppointments();
  if (fulfillAppointment.length < 1)
    return res.status(404).json({
      status: 'error',
      message: 'No fulfilled appointment found',
    });
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
