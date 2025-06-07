import { body } from 'express-validator';

export const appointmentValidator = [
  body('patientId').notEmpty(),
  body('message').notEmpty().isAlphanumeric(),
];
