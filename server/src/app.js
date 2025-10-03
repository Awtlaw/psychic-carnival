import 'dotenv/config';
import './auth/auth.js';
import './jobs/notifications.js';
import express from 'express';
import { users } from './routes/users.js';
import { appointments } from './routes/appointments.js';
import { reports } from './routes/reports.js';
import { uploads } from './routes/uploads.js';
import cors from 'cors';
import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';

import path from 'node:path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;
const whitelist = '*';
const corsOptions = { origin: whitelist };

app.use(
  express.static(
    path.join(path.dirname(fileURLToPath(import.meta.url)), 'public'),
  ),
);
// Add at the top, after creating `app`
app.use(helmet());

// const generalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 mins
//   max: 200,
// });

// Use general limiter globally:
// app.use(generalLimiter);
app.use(express.json());
app.use(cors(corsOptions));
app.use('/images', express.static('images'));

app.get('/', (req, res) => {
  res.json({ message: 'HealthConnect', success: true });
});
app.use('/api/user', users);
app.use('/api/report', reports);
app.use('/api/appointment', appointments);
app.use('/api/upload', uploads);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message,
  });
});
// Gullitrw@4192
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
