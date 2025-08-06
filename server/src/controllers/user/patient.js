import { hash, genSalt } from 'bcryptjs';
import { patients } from '../../database/queries.js';
import asyncHandler from 'express-async-handler';
import { patientValidator } from '../../validators/users.js';
import { validationResult } from 'express-validator';

export const addNewPatient = [
  patientValidator,
  asyncHandler(async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
      return res.status(400).json({
        message: 'Validation error',
        success: false,
        error: validationErrors.array(),
      });

    const {
      email,
      phone,
      firstName,
      lastName,
      password,
      dob,
      sex,
      address,
      proxy,
    } = req.body;

    const salt = await genSalt(10);
    const hashPwd = await hash(password, salt);
    const newPatient = await patients.createPatient(
      email,
      phone,
      firstName,
      lastName,
      hashPwd,
      dob,
      sex,
      address,
      proxy,
    );
    res
      .status(201)
      .json({ message: 'Created user', success: true, data: newPatient });
  }),
];

export const getPatients = asyncHandler(async (req, res) => {
  const allPatients = await patients.getAllPatients();
  if (allPatients.length === 0)
    return res
      .status(404)
      .json({ message: 'No patient found!', success: false });

  res.json({
    message: 'Retrieved users',
    success: true,
    data: [...allPatients],
  });
});

export const getPatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: 'Bad Request', success: false });

  const patient = await patients.getPatientById(id);
  res.json({ message: 'Retrieved user', success: true, data: patient });
});
