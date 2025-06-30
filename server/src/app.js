import 'dotenv/config';
import './auth/auth.js';
import express from 'express';
import { users } from './routes/users.js';
import { appointments } from './routes/appointments.js';
import { reports } from './routes/reports.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT;
const whitelist = '*';
const corsOptions = { origin: whitelist };

app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.json({ message: 'HealthConnect' });
});
app.use('/user', users);
app.use('/report', reports);
app.use('/appointment', appointments);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
