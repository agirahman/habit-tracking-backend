import express from 'express';
import habitController from '../controllers/habitController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', habitController.list);
router.post('/', habitController.create);
router.post('/:id/toggle', habitController.toggleToday);
router.put('/:id', habitController.update);
router.delete('/:id', habitController.remove);
router.get('/summary', habitController.summary);

export default router;
