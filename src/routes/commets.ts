import { Router } from 'express';
import { commetsController } from '../controllers/commets.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/task/:taskId', authMiddleware, commetsController.getByTask);
router.post('/',           authMiddleware, commetsController.create);
router.delete('/:id',      authMiddleware, commetsController.remove);

export default router;
