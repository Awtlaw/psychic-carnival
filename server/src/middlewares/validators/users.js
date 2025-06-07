import { body } from 'express-validator';
import { admins, patients, doctors } from '../../database/queries';

export const adminValidator = [
  body('email', 'Must be a valid email')
    .notEmpty()
    .isEmail()
    .custom(async (value) => {
      const user = await admins.getAdminByEmail(value);
      if (user) {
        throw new Error('E-mail already in use');
      }
    })
    .trim(),
  body('phone').notEmpty().trim(),
  body('firstName').notEmpty().isAlpha().trim(),
  body('lastName').notEmpty().isAlpha().trim(),
  body('password')
    .notEmpty()
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d\W_]{8,}$/)
    .withMessage(
      'Must contain an uppercase letter,a lowercase letter,a number and a special character',
    ),
];

export const doctorValidator = [
  body('email', 'Must be a valid email')
    .notEmpty()
    .isEmail()
    .custom(async (value) => {
      const user = await doctors.getDoctorByEmail(value);
      if (user) {
        throw new Error('E-mail already in use');
      }
    })
    .trim(),
  body('firstName').notEmpty().isAlpha().trim(),
  body('lastName').notEmpty().isAlpha().trim(),
  body('password')
    .notEmpty()
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d\W_]{8,}$/)
    .withMessage(
      'Must contain an uppercase letter,a lowercase letter,a number and a special character',
    ),
];

export const patientValidator = [
  body('email', 'Must be a valid email')
    .notEmpty()
    .isEmail()
    .custom(async (value) => {
      const user = await patients.getPatientByEmail(value);
      if (user) {
        throw new Error('E-mail already in use');
      }
    })
    .trim(),
  body('phone').notEmpty().trim(),
  body('firstName').notEmpty().isAlpha().trim(),
  body('lastName').notEmpty().isAlpha().trim(),
  body('password')
    .notEmpty()
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d\W_]{8,}$/)
    .withMessage(
      'Must contain an uppercase letter,a lowercase letter,a number and a special character',
    ),
  body('dob').notEmpty().isDate(),
  body('sex').notEmpty().isAlpha().isLength({ min: 1, max: 1 }).trim(),
  body('address').notEmpty().isAlphanumeric().trim(),
  body('proxy').optional().isJSON(),
];
