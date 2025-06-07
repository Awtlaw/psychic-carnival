import { Router } from 'express';
import { addNewAdmin, getAdmin, getAdmins } from '../controllers/user/admin.js';
import {
  addNewDoctor,
  getDoctor,
  getDoctors,
} from '../controllers/user/doctor.js';
import {
  addNewPatient,
  getPatient,
  getPatients,
} from '../controllers/user/patient.js';

export const users = Router();

// registration
users.post('/register/admin', addNewAdmin);
users.post('/register/doctor', addNewDoctor);
users.post('/register/patient', addNewPatient);

// users
users.get('/admin', getAdmins);
users.get('/admin/:id', getAdmin);

users.get('/doctor', getDoctors);
users.get('/doctor/:id', getDoctor);

users.get('/patient', getPatients);
users.get('/patient/:id', getPatient);
