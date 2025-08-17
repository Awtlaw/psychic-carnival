import { body } from 'express-validator';

export const reportValidator = [
  body('patientId').notEmpty(),
  body('diagnosis').notEmpty(),
];
