import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import { appointments } from '../../database/queries.js';
import { appointmentValidator } from '../../validators/appointments.js';
import { validationResult } from 'express-validator';
import { sendBookingMail, sendReminderMail } from '../../utils/mail.js';
import axios from 'axios';

const APP_BASE = process.env.APP_BASE;

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

    const { patientId, doctor, message } = req.body;

    const newAppointment = await appointments.bookAppointment(
      patientId,
      doctor.id,
      message,
    );

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
      `${doctor.fname} ${doctor.lname}`,
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

export const getAvailableDoc = asyncHandler(async (req, res) => {
  // 1. Fetch the list of doctors
  const { data } = await axios.get(`${APP_BASE}/api/user/doctor`, {
    headers: {
      Authorization: `Bearer ${req.user.tk}`,
    },
  });
  const doctorsList = data.data;

  // 2. Efficiently get the count for each doctor in parallel
  //    Map to an array of promises that resolve to { doctorId, count }
  const loadPromises = doctorsList.map(async (doc) => {
    const load = await appointments.countAppointmentsPerDoc(doc.id);
    return { doctor: doc, load }; // Attach the full doctor object and its load
  });

  // 3. Wait for all counts to be resolved (use allSettled for robustness)
  const loadResults = await Promise.allSettled(loadPromises);

  // 4. Handle results: only use successfully fulfilled promises
  const doctorsWithLoad = loadResults
    .filter((result) => result.status === 'fulfilled') // Keep only successful results
    .map((result) => result.value); // Extract the value { doctor, load }

  // 5. Check if we have any doctors left after filtering out errors
  if (doctorsWithLoad.length === 0) {
    return res.status(500).json({
      message: 'Could not calculate load for any doctors.',
      success: false,
    });
  }

  // 6. Find the minimum load value from the successful results
  const minLoad = Math.min(...doctorsWithLoad.map((item) => item.load));

  // 7. Find all doctors who have this minimum load (the candidates)
  const candidates = doctorsWithLoad.filter((item) => item.load === minLoad);

  // 8. Tie-breaking: For your PoC, simply pick the first candidate.
  const assignedDoctor =
    candidates[Math.floor(Math.random() * candidates.length)];

  // 9. Respond with the assigned doctor's information
  res.json({
    message: 'Doctor assigned successfully',
    success: true,
    data: assignedDoctor, // Send back the chosen doctor's details
  });
});
