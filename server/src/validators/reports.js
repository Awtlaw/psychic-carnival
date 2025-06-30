import { body } from 'express-validator';

export const reportValidator = [
  body('patientId').notEmpty(),
  body('doctorId').notEmpty(),
  body('diagnosis').notEmpty().isAlphanumeric(),
];
