import 'dotenv/config';
import { appointments, patients } from '../../database/queries.js';
import asyncHandler from 'express-async-handler';
import { appointmentValidator } from '../../validators/appointments.js';
import { validationResult } from 'express-validator';
import { sendBookingMail, sendReminderMail } from '../../utils/mail.js';
import axios from 'axios';
import { calculateAge } from '../../utils/extras.js';

export const bookNewAppointment = [
  appointmentValidator,
  asyncHandler(async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
      return res.status(400).json({
        message: 'Validation error',
        success: false,
        error: validationErrors.array(),
      });

    if (req.body.message === undefined)
      return res.status(400).json({ message: 'Bad Request', success: false });

    const { patientId, message } = req.body;

    const patient = await patients.getPatientById(patientId);
    const suspicion = `${calculateAge(patient.dob)}, ${patient.sex}, ${message.reason}`;

    const { data } = await axios.post(
      `${process.env.APP_BASE}/report/`,
      { patientId, diagnosis: suspicion },
      { headers: { 'Content-Type': 'application/json' } },
    );

    const newAppointment = await appointments.bookAppointment(
      patientId,
      message,
    );

    newAppointment.symptomCheckerResults = JSON.parse(
      data.data.diagnosis,
    ).data.response;

    res.status(201).json({
      message: 'Appointment created',
      success: true,
      data: newAppointment,
    });

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
      message: 'No pending appointment found',
      success: false,
    });

  res.json({
    message: 'Retrieved pending appointments',
    success: true,
    data: [...pendingAppointments],
  });
});

export const getFulfilledAppointments = asyncHandler(async (req, res) => {
  const fulfilledAppointments = await appointments.findFulfilledAppointments();

  if (fulfilledAppointments.length < 1)
    return res.status(404).json({
      message: 'No fulfilled appointment found',
      success: false,
    });

  res.json({
    message: 'Retrieved fullfilled appoinments',
    success: true,
    data: [...fulfilledAppointments],
  });
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: 'Bad Request', success: false });

  await appointments.cancelAppointment(id);
  res.json({ message: 'Operation successful', success: true });
});

export const fulfillAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: 'Bad Request', success: false });
  await appointments.fulfillAppointment(id);
  res.json({ message: 'Operation successful', success: true });
});

export const sendReminder = asyncHandler(async (req, res) => {
  const { data } = await axios.get(
    `${process.env.APP_BASE}/appointment/pending`,
  );

  const filteredData = data?.data.filter((appointment) => {
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
    success: true,
    data: [...filteredData],
  });
});
