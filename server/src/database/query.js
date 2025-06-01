import { pool } from './pool.js';

export const createUser = async (
  fname,
  lname,
  pwd,
  profile,
  license,
  statusbadge,
  type,
  email,
  phone,
) => {
  await pool.query(
    'INSERT INTO users (fname, lname,pwd, profile, license, statusbadge, type,email,phone) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
    [fname, lname, pwd, profile, license, statusbadge, type, email, phone],
  );
};
export const createPatient = async (
  fname,
  lname,
  dob,
  gender,
  email,
  phone,
  pwd,
  profile,
) => {
  await pool.query(
    ' INSERT INTO patients (fname,lname,dob,gender,email,phone,pwd, profile) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
    [fname, lname, dob, gender, email, phone, pwd, profile],
  );
};
createPatient(
  'manuel',
  'junior',
  '2003-05-21',
  'male',
  'k@mail.com',
  '123456789',
  '1234',
  'profile.jpg',
);
