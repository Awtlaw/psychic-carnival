import { hash, genSalt, compare } from 'bcryptjs';
import { admins } from '../../database/queries.js';
import asyncHandler from 'express-async-handler';
import { adminValidator } from '../../validators/users.js';
import { validationResult } from 'express-validator';

export const addNewAdmin = [
  adminValidator,
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
    const newAdmin = await admins.createAdmin(
      email,
      phone,
      firstName,
      lastName,
      hashPwd,
    );
    res
      .status(201)
      .json({ message: 'Created user', success: true, data: newAdmin });
  }),
];

export const getAdmins = asyncHandler(async (req, res) => {
  const allAdmins = await admins.getAllAdmins();
  if (allAdmins.length === 0)
    return res.status(404).json({ message: 'No admin found!', success: false });

  res.json({ message: 'Retrieved users', success: true, data: [...allAdmins] });
});

export const getAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: 'Bad Request', success: false });

  const admin = await admins.getAdminById(id);
  res.json({ message: 'Retrieved user', success: true, data: admin });
});

export const changeAdminPassword = asyncHandler(async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;

  if (!id || !oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  // Get admin from DB
  const admin = await admins.getAdminById(id);
  if (!admin) {
    return res.status(404).json({ success: false, message: 'Admin not found' });
  }
  console.log(admin);
  // Verify old password
  const isMatch = await compare(oldPassword, admin.pwd);
  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid old password' });
  }

  // Hash new password
  const salt = await genSalt(10);
  const hashed = await hash(newPassword, salt);

  // Update in DB
  await admins.updateAdminPassword(id, hashed);

  res.json({ success: true, message: 'Password updated successfully' });
});
