import { Router } from 'express';
import { addNewAdmin, getAdmin, getAdmins } from '../controllers/user/admin.js';
import {
  addNewDoctor,
  changePassword,
  deleteDoc,
  getDoctor,
  getDoctors,
  updateDocContact,
} from '../controllers/user/doctor.js';
import {
  addNewPatient,
  getPatient,
  getPatients,
  updatePatientInfo,
} from '../controllers/user/patient.js';
import expressAsyncHandler from 'express-async-handler';
import { authenticateUser } from '../middlewares/login.js';
import { ProtectRoute } from '../middlewares/secure.js';

export const users = Router();

// registration
users.post('/register/admin', addNewAdmin);
users.post('/register/doctor', ProtectRoute, addNewDoctor);
users.post('/register/patient', addNewPatient);

// login
users.post('/login', expressAsyncHandler(authenticateUser));

// users
users.get('/admin', ProtectRoute, getAdmins);
users.get('/admin/:id', ProtectRoute, getAdmin);

users.get('/doctor', ProtectRoute, getDoctors);
users.get('/doctor/:id', ProtectRoute, getDoctor);
users.put('/doctor/change-password', ProtectRoute, changePassword);
users.put('/doctor/contact', ProtectRoute, updateDocContact);
users.delete('/doctor/delete', ProtectRoute, deleteDoc);

users.get('/patient', ProtectRoute, getPatients);
users.get('/patient/:id', ProtectRoute, getPatient);
users.put('/patient/contact', ProtectRoute, updatePatientInfo);
