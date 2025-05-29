import { Pool } from 'pg';
export const pool = new Pool({
  user: 'postgres',
  password: 'mj1234',
  host: 'localhost',
  port: '5432',
  database: 'HealthConnect',
});
