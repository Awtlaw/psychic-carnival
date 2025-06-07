import { hash, genSalt } from 'bcryptjs';
import { doctors } from '../../database/queries.js';

// TODO: add err handling to controller logic
// TODO: add validator
// TODO: add async handler

export const addNewDoctor = async (req, res) => {
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
};

export const getDoctors = async (req, res) => {
  const allDoctors = await doctors.getAllDoctors();
  if (allDoctors.length === 0)
    return res
      .status(404)
      .json({ status: 'error', message: 'No patient found!' });
  res.json([...allDoctors]);
};

export const getDoctor = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ status: 'error', message: 'Bad Request' });
  const doctor = await doctors.getDoctorById(id);
  res.json(doctor);
};
