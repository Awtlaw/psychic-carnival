import { hash, genSalt } from 'bcryptjs';
import { doctors } from '../../database/queries.js';
import asyncHandler from 'express-async-handler';
import { doctorValidator } from '../../middlewares/validators/users.js';
import { validationResult } from 'express-validator';

export const addNewDoctor = [
  doctorValidator,
  asyncHandler(async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
      return res
        .status(400)
        .json({ status: 'Validation Error', error: validationErrors.array() });
    if (req.body === undefined)
      return res.status(400).json({ status: 'error', message: 'Bad Request' });
    const { email, phone, firstName, lastName, password } = req.body;
    const salt = await genSalt(10);
    const hashPwd = await hash(password, salt);
    const newDoctor = await doctors.createDoctor(
      email,
      phone,
      firstName,
      lastName,
      hashPwd,
    );
    res.status(201).json(newDoctor);
  }),
];

export const getDoctors = asyncHandler(async (req, res) => {
  const allDoctors = await doctors.getAllDoctors();
  if (allDoctors.length === 0)
    return res
      .status(404)
      .json({ status: 'error', message: 'No patient found!' });
  res.json([...allDoctors]);
});
export const getDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ status: 'error', message: 'Bad Request' });
  const doctor = await doctors.getDoctorById(id);
  res.json(doctor);
});
