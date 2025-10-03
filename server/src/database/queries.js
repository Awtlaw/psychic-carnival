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
      omit: {
        pwd: true,
      },
    });
    return newAdmin;
  },

  getAllAdmins: async () => {
    const admins = await prisma.admin.findMany({
      omit: {
        pwd: true,
      },
    });
    return admins;
  },

  getAdminById: async (id) => {
    const admin = await prisma.admin.findUnique({
      where: {
        id: +id,
      },
    });
    return admin;
  },

  getAdminByEmail: async (email) => {
    const admin = await prisma.admin.findFirst({
      where: {
        email,
      },
      omit: {},
    });
    return admin;
  },
  updateAdminPassword: async (id, hash) => {
    try {
      const updatedAdmin = await prisma.admin.update({
        where: { id: Number(id) },
        data: { pwd: hash },
        omit: { pwd: true },
      });
      return updatedAdmin;
    } catch (e) {
      console.error(e);
      throw e;
    }
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
        mustChangePassword: true, // Force password change on first login
      },
      omit: {
        pwd: true,
      },
    });
    return newDoctor;
  },

  getAllDoctors: async () => {
    const doctors = await prisma.doctor.findMany({
      omit: {
        pwd: true,
      },
    });
    return doctors;
  },

  getDoctorById: async (id) => {
    const doctor = await prisma.doctor.findUnique({
      where: {
        id: +id,
      },
      omit: {
        pwd: true,
      },
    });
    return doctor;
  },

  getDoctorByEmail: async (email) => {
    const doctor = await prisma.doctor.findFirst({
      where: {
        email,
      },
      omit: {},
    });
    return doctor;
  },

  updatePassword: async (email, hash) => {
    try {
      await prisma.doctor.update({
        where: { email },
        data: { pwd: hash, mustChangePassword: false }, // Reset flag after password change
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  removeDoctorByEmail: async (email) => {
    try {
      await prisma.doctor.delete({
        where: { email },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },

  uploadDoctorPfp: async (email, filename) => {
    await prisma.doctor.update({
      where: { email },
      data: { profileImg: filename },
    });
  },

  updateDoctor: async (id, phone) => {
    const patient = await prisma.patient.update({
      where: { id },
      data: { phone },
    });
    return patient;
  },
};

export const patients = {
  uploadPatientPfp: async (email, filename) => {
    await prisma.patient.update({
      where: { email },
      data: { profileImg: filename },
    });
  },
  createPatient: async (...params) => {
    const newPatient = await prisma.patient.create({
      data: {
        email: params[0],
        phone: params[1],
        fname: params[2],
        lname: params[3],
        pwd: params[4],
        dob: params[5],
        sex: params[6],
        proxy: params[8],
        address: params[7],
      },
      omit: {
        pwd: true,
      },
    });
    return newPatient;
  },

  getAllPatients: async () => {
    const patients = await prisma.patient.findMany({
      omit: {
        pwd: true,
      },
    });
    return patients;
  },

  getPatientById: async (id) => {
    const patient = await prisma.patient.findUnique({
      where: {
        id: +id,
      },
      omit: {
        pwd: true,
      },
    });
    return patient;
  },

  getPatientByEmail: async (email) => {
    const patient = await prisma.patient.findFirst({
      where: {
        email,
      },
      omit: {},
    });
    return patient;
  },

  updatePatient: async (id, phone, address) => {
    const patient = await prisma.patient.update({
      where: { id },
      data: { phone, address },
    });
    return patient;
  },

  updatePassword: async (email, hash) => {
    try {
      await prisma.patient.update({
        where: { email },
        data: { pwd: hash },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
};

export const appointments = {
  bookAppointment: async (patientId, doctorId, message) => {
    const newAppointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        message,
      },
    });
    return newAppointment;
  },

  findPendingAppointments: async () => {
    const appointments = await prisma.appointment.findMany({
      where: {
        status: 'PENDING',
      },
    });
    return appointments;
  },

  findFulfilledAppointments: async () => {
    const appointments = await prisma.appointment.findMany({
      where: {
        status: 'FULFILLED',
      },
    });
    return appointments;
  },

  cancelAppointment: async (id) => {
    const appointment = await prisma.appointment.update({
      where: { id: +id },
      data: {
        status: 'CANCELLED',
      },
    });
    return appointment;
  },

  fulfillAppointment: async (id) => {
    const appointment = await prisma.appointment.update({
      where: { id: +id },
      data: {
        status: 'FULFILLED',
      },
    });
    return appointment;
  },

  countAppointmentsPerDoc: async (docId) => {
    const results = await prisma.appointment.count({
      where: {
        status: 'PENDING',
        doctor: { id: docId },
      },
    });
    return results;
  },
};

export const reports = {
  createReport: async (patientId, doctorId, diagnosis) => {
    const newReport = await prisma.report.create({
      data: {
        patientId,
        doctorId,
        diagnosis,
      },
    });
    return newReport;
  },

  getAllReports: async () => {
    const reports = await prisma.report.findMany();
    return reports;
  },

  getReportById: async (id) => {
    const report = await prisma.report.findUnique({
      where: {
        id: +id,
      },
    });
    return report;
  },
  updateNotes: async (id, notes) => {
    return await prisma.report.update({
      where: { id: Number(id) },
      data: { notes },
    });
  },
  fulfillReport: async (id) => {
    return await prisma.report.update({
      where: { id: Number(id) },
      data: {
        status: 'FULFILLED', // 👈 make sure you added `status` in your schema
      },
    });
  },
};
