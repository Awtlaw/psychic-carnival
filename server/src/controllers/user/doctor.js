import { hash, genSalt, compare } from 'bcryptjs';
import { doctors } from '../../database/queries.js';
import asyncHandler from 'express-async-handler';
import { doctorValidator } from '../../validators/users.js';
import { validationResult } from 'express-validator';
import { sendDocDetails } from '../../utils/mail.js';

export const addNewDoctor = [
  doctorValidator,
  asyncHandler(async (req, res) => {
    if (req.user.role !== 'ADMIN')
      return res
        .status(403)
        .json({ message: 'Forbidden Access', success: false });

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

    sendDocDetails(email, `${firstName} ${lastName}`);
  }),
];

export const getDoctors = asyncHandler(async (req, res) => {
  const allDoctors = await doctors.getAllDoctors();
  if (allDoctors.length === 0)
    return res
      .status(404)
      .json({ message: 'No doctor found!', success: false });

  res.json({
    message: 'Retrieved users',
    success: true,
    data: [...allDoctors],
  });
});

export const getDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: 'Bad Request', success: false });

  const doctor = await doctors.getDoctorById(id);
  res.json({ message: 'Retrieved user', sucess: true, data: doctor });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { email, oldPwd, newPwd } = req.body;
  const user = await doctors.getDoctorByEmail(email);
  if (!user) return res.status(404).json({ message: 'No doctor found!' });
  if (oldPwd === newPwd)
    return res
      .status(400)
      .json({ message: 'Cannot use old password', success: false });

  const isValid = await compare(oldPwd, user.pwd);
  if (!isValid)
    return res
      .status(400)
      .json({ message: 'Wrong credentials', success: false });

  const salt = await genSalt(10);
  const newPwdHashed = await hash(newPwd, salt);
  await doctors.updatePassword(email, newPwdHashed);

  res.json({ message: 'Password update success', success: true });
});

export const deleteDoc = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN')
    return res
      .status(403)
      .json({ message: 'Forbidden Access', success: false });

  const { email } = req.email;

  await doctors.removeDoctorByEmail(email);
  res.json({ message: 'Operation successful', success: true });
});
