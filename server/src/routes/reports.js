import { Router } from 'express';
import {
  createNewReport,
  getReport,
  getReports,
  updateReportNotes,
  fulfillReport,
} from '../controllers/checker/report.js';
import { checkSymptoms } from '../controllers/checker/predict.js';
import { ProtectRoute } from '../middlewares/secure.js';

// ✅ import protect
export const reports = Router();

reports.post('/', createNewReport);
reports.post('/diagnosis', checkSymptoms);

reports.get('/', getReports);
reports.get('/:id', getReport);
// ✅ New route for updating doctor's notes
reports.patch('/:id/notes', updateReportNotes);
reports.patch('/:id/fulfill', ProtectRoute, fulfillReport);
