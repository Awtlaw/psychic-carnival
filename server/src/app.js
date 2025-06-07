import 'dotenv/config';
import express from 'express';
import { users } from './routes/users.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});
app.use('/user', users);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
