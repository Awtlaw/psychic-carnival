import { Router } from 'express';
import {
  bookNewAppointment,
  cancelAppointment,
  fulfillAppointment,
  getAvailableDoc,
  getFulfilledAppointments,
  getPendingAppointments,
  sendReminder,
} from '../controllers/booking/appointment.js';
import { ProtectRoute } from '../middlewares/secure.js';

export const appointments = Router();

appointments.get('/pending', getPendingAppointments);
appointments.get('/fulfilled', ProtectRoute, getFulfilledAppointments);
appointments.get('/assignment', ProtectRoute, getAvailableDoc);

appointments.post('/', ProtectRoute, bookNewAppointment);
appointments.post('/reminder', sendReminder);

appointments.put('/cancel/:id', ProtectRoute, cancelAppointment);
appointments.put('/fulfill/:id', ProtectRoute, fulfillAppointment);
