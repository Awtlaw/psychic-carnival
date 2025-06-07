import { hash, genSalt } from 'bcryptjs';
import { doctors } from '../../database/queries.js';

// TODO: add err handling to controller logic
// TODO: add validator
// TODO: add async handler

export const addNewDoctor = async (req, res) => {
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
  res.json([...allDoctors]);
};

export const getDoctor = async (req, res) => {
  const { id } = req.params;
  const doctor = await doctors.getDoctorById(id);
  res.json(doctor);
};
