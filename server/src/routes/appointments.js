import { Router } from 'express';
import {
  bookNewAppointment,
  cancelAppointment,
  fulfillAppointment,
  getFulfilledAppointments,
  getPendingAppointments,
  sendReminder,
} from '../controllers/booking/appointment.js';

export const appointments = Router();

appointments.get('/pending', getPendingAppointments);
appointments.get('/fulfilled', getFulfilledAppointments);

appointments.post('/', bookNewAppointment);
appointments.post('/reminder', sendReminder);

appointments.put('/cancel/:id', cancelAppointment);
appointments.put('/fulfill/:id', fulfillAppointment);
