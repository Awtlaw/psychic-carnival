import { Router } from 'express';
import {
  createNewReport,
  getReport,
  getReports,
} from '../controllers/checker/report';
export const reports = Router();

reports.post('/', createNewReport);

reports.get('/', getReports);
reports.get('/:id', getReport);
