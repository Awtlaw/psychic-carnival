import { Router } from 'express';
import {
  addNewAdmin,
  getAdmin,
  getAdmins,
  changeAdminPassword,
} from '../controllers/user/admin.js';
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
  changePassword as changePatientPassword,
} from '../controllers/user/patient.js';
import expressAsyncHandler from 'express-async-handler';
import { authenticateUser } from '../middlewares/login.js';
import { ProtectRoute } from '../middlewares/secure.js';
import {
  handlePasswordResetRequest,
  handlePasswordReset,
} from '../passwordResetService.js';
import rateLimit from 'express-rate-limit';

export const users = Router();
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many requests from this IP, please try again later.',
});

// registration
users.post('/register/admin', authLimiter, addNewAdmin);
users.post('/register/doctor', authLimiter, ProtectRoute, addNewDoctor);
users.post('/register/patient', authLimiter, addNewPatient);

// login
users.post('/login', authLimiter, expressAsyncHandler(authenticateUser));

// users
users.get('/admin', ProtectRoute, getAdmins);
users.get('/admin/:id', ProtectRoute, getAdmin);
users.put('/admin/change-password', ProtectRoute, changeAdminPassword);
users.post('/admin/forgot-password', authLimiter, handlePasswordResetRequest);
users.post('/admin/reset-password', authLimiter, handlePasswordReset);

users.get('/doctor', ProtectRoute, getDoctors);
users.get('/doctor/:id', ProtectRoute, getDoctor);
users.put('/doctor/change-password', ProtectRoute, changePassword);
users.put('/doctor/contact', ProtectRoute, updateDocContact);
users.delete('/doctor/delete', ProtectRoute, deleteDoc);
users.post('/doctor/forgot-password', authLimiter, handlePasswordResetRequest);
users.post('/doctor/reset-password', authLimiter, handlePasswordReset);

users.get('/patient', ProtectRoute, getPatients);
users.get('/patient/:id', ProtectRoute, getPatient);
users.put('/patient/contact', ProtectRoute, updatePatientInfo);
users.put('/patient/change-password', ProtectRoute, changePatientPassword);
users.post('/patient/forgot-password', authLimiter, handlePasswordResetRequest);
users.post('/patient/reset-password', authLimiter, handlePasswordReset);
