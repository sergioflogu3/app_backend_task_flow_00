import { Router } from 'express';
import { commetsController } from '../controllers/commets.controller';

const router = Router();

router.get('/task/:taskId', commetsController.getByTask);
router.post('/',            commetsController.create);
router.delete('/:id',       commetsController.remove);

export default router;
