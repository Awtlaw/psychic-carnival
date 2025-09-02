import { Router } from 'express';
import { ProtectRoute } from '../middlewares/secure.js';
import { getImage, uploadImage } from '../controllers/user/patient.js';
import multer from 'multer';

export const uploads = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

uploads.post('/image', ProtectRoute, upload.single('image'), uploadImage);
uploads.get('/image/:filename', getImage);
