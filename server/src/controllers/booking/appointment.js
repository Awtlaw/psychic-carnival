import { appointments } from '../../database/queries';

export const bookNewAppointment = async (req, res) => {
  if (req.body === undefined)
    return res.status(400).json({ status: 'error', message: 'Bad Request' });
  const { patientId, message } = req.body;
  const newAppointment = await appointments.bookAppointment(patientId, message);
  res.status(201).json(newAppointment);
};

export const getPendingAppointments = async (req, res) => {
  const pendingAppointments = await appointments.findPendingAppointments();
  res.json([...pendingAppointments]);
};

export const getFulfilledAppointments = async (req, res) => {
  const fulfilledAppointments = await appointments.findFulfilledAppointments();
  res.json([...fulfilledAppointments]);
};

export const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ status: 'error', message: 'Bad Request' });
  await appointments.cancelAppointment(id);
  res.json('Operation Successful');
};

export const fulfillAppointment = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ status: 'error', message: 'Bad Request' });
  await appointments.fulfillAppointment(id);
  res.json('Operation Successful');
};
