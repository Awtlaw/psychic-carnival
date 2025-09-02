import path from 'path';
import fs from 'node:fs';
import { hash, genSalt } from 'bcryptjs';
import { doctors, patients } from '../../database/queries.js';
import asyncHandler from 'express-async-handler';
import { patientValidator } from '../../validators/users.js';
import { validationResult } from 'express-validator';
import { randomString } from '../../utils/extras.js';

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

export const uploadImage = asyncHandler(async (req, res) => {
  const uploadDir = 'images';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  if (!req.file) {
    return res
      .status(400)
      .json({ message: 'No image uploaded', success: false });
  }

  const ext = path.extname(req.file.originalname); // e.g. ".png"
  const randStr = randomString();
  const base = path.basename(req.file.originalname, ext);
  const filename = `${base}_${randStr}${ext}`;

  switch (req.user.role) {
    case 'PATIENT':
      await patients.uploadPatientPfp(req.body.email, filename);
      break;
    case 'DOCTOR':
      await doctors.uploadDoctorPfp(req.body.email, filename);
      break;
  }

  const filePath = path.join(uploadDir, filename);

  // Write file buffer to disk
  fs.writeFileSync(filePath, req.file.buffer);

  res.json({ message: 'Image uploaded', success: true, filename: filePath });
});

export const getImage = asyncHandler(async (req, res) => {
  const filePath = path.resolve('images', req.params.filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'Image not found', success: false });
  }
});
