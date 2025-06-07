import { hash, genSalt } from 'bcryptjs';
import { patients } from '../../database/queries.js';
import asyncHandler from 'express-async-handler';
import { patientValidator } from '../../middlewares/validators/users.js';
import { validationResult } from 'express-validator';

export const addNewPatient = [
  patientValidator,
  asyncHandler(async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
      return res
        .status(400)
        .json({ status: 'Validation Error', error: validationErrors.array() });
    if (req.body === undefined)
      return res.status(400).json({ status: 'error', message: 'Bad Request' });
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
    res.status(201).json(newPatient);
  }),
];

export const getPatients = asyncHandler(async (req, res) => {
  const allPatients = await patients.getAllPatients();
  if (allPatients.length === 0)
    return res
      .status(404)
      .json({ status: 'error', message: 'No patient found!' });
  res.json([...allPatients]);
});
export const getPatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ status: 'error', message: 'Bad Request' });
  const patient = await patients.getPatientById(id);
  res.json(patient);
});
