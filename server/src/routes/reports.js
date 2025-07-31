import { Router } from 'express';
import {
  createNewReport,
  getReport,
  getReports,
} from '../controllers/checker/report.js';
import { checkSymptoms } from '../controllers/checker/predict.js';
export const reports = Router();

reports.post('/', createNewReport);
reports.post('/diagnosis', checkSymptoms);

reports.get('/', getReports);
reports.get('/:id', getReport);
