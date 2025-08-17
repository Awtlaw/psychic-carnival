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
import expressAsyncHandler from 'express-async-handler';
import { authenticateUser } from '../middlewares/login.js';
import { ProtectRoute } from '../middlewares/secure.js';

export const users = Router();

// registration
users.post('/register/admin', addNewAdmin);
users.post('/register/doctor', addNewDoctor);
users.post('/register/patient', addNewPatient);

// login
users.post('/login', expressAsyncHandler(authenticateUser));

// users
users.get('/admin', ProtectRoute, getAdmins);
users.get('/admin/:id', ProtectRoute, getAdmin);

users.get('/doctor', ProtectRoute, getDoctors);
users.get('/doctor/:id', ProtectRoute, getDoctor);

users.get('/patient', ProtectRoute, getPatients);
users.get('/patient/:id', ProtectRoute, getPatient);
