// src/routes/aiRoutes.js
import express from 'express';
import aiController from '../controllers/aiController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/motivation', aiController.getMotivation);
router.get('/suggest-habits', aiController.suggestHabits);

export default router;