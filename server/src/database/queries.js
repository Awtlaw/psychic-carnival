import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const admins = {
  createAdmin: async (email, phone, fname, lname, pwd) => {
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        phone,
        fname,
        lname,
        pwd,
      },
    });
    return newAdmin;
  },

  getAdminById: async (id) => {
    const admin = await prisma.admin.findUnique({
      where: {
        id,
      },
    });
    return admin;
  },
};

export const doctors = {
  createDoctor: async (email, phone, fname, lname, pwd) => {
    const newDoctor = await prisma.doctor.create({
      data: {
        email,
        phone,
        fname,
        lname,
        pwd,
      },
    });
    return newDoctor;
  },

  getDoctorById: async (id) => {
    const doctor = await prisma.doctor.findUnique({
      where: {
        id,
      },
    });
    return doctor;
  },
};

export const patients = {
  createPatient: async (
    email,
    phone,
    fname,
    lname,
    pwd,
    dob,
    sex,
    address,
    proxy,
  ) => {
    const newPatient = await prisma.patient.create({
      data: {
        email,
        phone,
        fname,
        lname,
        pwd,
        dob,
        sex,
        proxy,
        address,
      },
    });
    return newPatient;
  },

  getPatientById: async (id) => {
    const patient = await prisma.patient.findUnique({
      where: {
        id,
      },
    });
    return patient;
  },
};

export const appointments = {
  bookAppointment: async (patientId, message) => {
    const newAppointment = await prisma.appointment.create({
      data: {
        patientId,
        message,
      },
    });
    return newAppointment;
  },

  cancelAppointment: async (id) => {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });
    return appointment;
  },

  fulfillAppointment: async (id) => {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'FULFILLED',
      },
    });
    return appointment;
  },
};

export const reports = {};
