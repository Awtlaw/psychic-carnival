import { body } from 'express-validator';

export const appointmentValidator = [
  body('patientId').notEmpty(),
  body('message').notEmpty().isObject().withMessage('Value must be an object'),
];
