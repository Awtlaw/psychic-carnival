import { hash, genSalt } from 'bcryptjs';
import { patients } from '../../database/queries.js';

// TODO: add err handling to controller logic
// TODO: add validator
// TODO: add async handler

export const addNewPatient = async (req, res) => {
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
};

export const getPatients = async (req, res) => {
  const allPatients = await patients.getAllPatients();
  res.json([...allPatients]);
};

export const getPatient = async (req, res) => {
  const { id } = req.params;
  const patient = await patients.getPatientById(id);
  res.json(patient);
};
