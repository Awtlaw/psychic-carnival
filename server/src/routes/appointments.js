import { Router } from 'express';
import {
  bookNewAppointment,
  cancelAppointment,
  fulfillAppointment,
  getFulfilledAppointments,
  getPendingAppointments,
} from '../controllers/booking/appointment.js';

export const appointments = Router();

appointments.get('/pending', getPendingAppointments);
appointments.get('/fulfilled', getFulfilledAppointments);

appointments.post('/', bookNewAppointment);

appointments.put('/cancel/:id', cancelAppointment);
appointments.put('/fulfill/:id', fulfillAppointment);
