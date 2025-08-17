import { hash, genSalt } from 'bcryptjs';
import { doctors } from '../../database/queries.js';
import asyncHandler from 'express-async-handler';
import { doctorValidator } from '../../validators/users.js';
import { validationResult } from 'express-validator';

export const addNewDoctor = [
  doctorValidator,
  asyncHandler(async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty())
      return res.status(400).json({
        message: 'Validation error',
        success: false,
        error: validationErrors.array(),
      });

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
    res
      .status(201)
      .json({ message: 'Created user', success: true, data: newDoctor });
  }),
];

export const getDoctors = asyncHandler(async (req, res) => {
  const allDoctors = await doctors.getAllDoctors();
  if (allDoctors.length === 0)
    return res
      .status(404)
      .json({ message: 'No patient found!', success: false });

  res.json({
    message: 'Retrieved users',
    success: true,
    data: [...allDoctors],
  });
});

export const getDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: 'Bad Request', succes: false });

  const doctor = await doctors.getDoctorById(id);
  res.json({ message: 'Retrieved user', sucess: true, data: doctor });
});
