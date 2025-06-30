import { appointments } from '../../database/queries.js';
import asyncHandler from 'express-async-handler';
import { appointmentValidator } from '../../validators/appointments.js';
import { validationResult } from 'express-validator';
import { sendBookingMail, sendReminderMail } from '../../utils/mail.js';
import axios from 'axios';
import 'dotenv/config';

export const bookNewAppointment = [
  appointmentValidator,
  asyncHandler(async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
      return res
        .status(400)
        .json({ status: 'Validation Error', error: validationErrors.array() });
    if (req.body.message === undefined)
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
  if (fulfilledAppointments.length < 1)
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

export const sendReminder = asyncHandler(async (req, res) => {
  try {
    const { data } = await axios.get(
      `${process.env.APP_BASE}/appointment/pending`,
    );
    const filteredData = data?.filter((appointment) => {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const nextDay = tomorrow.toLocaleString().split(',')[0];
      const appointmentDate = new Date(appointment.message.date);

      return nextDay === appointmentDate.toLocaleString().split(',')[0];
    });

    filteredData.map((appointment) => {
      sendReminderMail(
        appointment.message.recipient,
        appointment.message.fullName,
        appointment.message.date,
        appointment.message.period,
        appointment.message.reason,
      );
    });
    res.json({
      message: 'Reminder notification sent successfully!',
      sent: [...filteredData],
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', message: `An error occured: ${error.message}` });
  }
});
