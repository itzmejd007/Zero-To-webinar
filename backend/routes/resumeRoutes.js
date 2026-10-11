import { Router } from 'express';
import { healthCheck, compareResumeController } from '../controllers/resumeController.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/health', healthCheck);
router.post('/compare', upload.single('resume'), compareResumeController);

export default router;
