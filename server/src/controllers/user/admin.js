import { hash, genSalt } from 'bcryptjs';
import { admins } from '../../database/queries.js';

// TODO: add err handling to controller logic
// TODO: add validator
// TODO: add async handler

export const addNewAdmin = async (req, res) => {
  const { email, phone, firstName, lastName, password } = req.body;
  const salt = await genSalt(10);
  const hashPwd = await hash(password, salt);
  const newAdmin = await admins.createAdmin(
    email,
    phone,
    firstName,
    lastName,
    hashPwd,
  );
  res.status(201).json(newAdmin);
};

export const getAdmins = async (req, res) => {
  const allAdmins = await admins.getAllAdmins();
  res.json([...allAdmins]);
};

export const getAdmin = async (req, res) => {
  const { id } = req.params;
  const admin = await admins.getAdminById(id);
  res.json(admin);
};
