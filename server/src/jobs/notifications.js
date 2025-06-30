import axios from 'axios';
import { CronJob } from 'cron';
import 'dotenv/config';

export const sendAppointmentReminder = new CronJob(
  '0 18 * * *',
  async () => {
    console.log('Running scheduled task at 18:00 hrs...');
    await axios.post(`${process.env.APP_BASE}/appointment/reminder`);
  },
  null,
  true,
);
