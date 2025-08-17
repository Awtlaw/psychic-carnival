import asyncHandler from 'express-async-handler';
import SymptomChecker from '../../knowledge/rag.js';

export const checkSymptoms = asyncHandler(async (req, res) => {
  const { query } = req.body;
  if (!query)
    return res.status(400).json({ message: 'Bad Request', success: false });

  const prediction = await SymptomChecker.query(query);
  res.json({
    message: 'Symptoms check successful',
    success: true,
    data: prediction,
  });
});
