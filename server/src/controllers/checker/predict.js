import asyncHandler from 'express-async-handler';
import SymptomChecker from '../../knowledge/rag.js';

export const checkSymptoms = asyncHandler(async (req, res) => {
  const { query } = req.body;
  if (!query)
    return res.status(400).json({ status: 'error', message: 'Bad Request' });
  const prediction = await SymptomChecker.query(query);
  res.json(prediction);
});
