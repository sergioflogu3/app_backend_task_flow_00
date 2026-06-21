import { Router } from 'express';
import { tasksController } from '../controllers/tasks.controller';
import { validate } from '../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schemas';

const router = Router();

router.get('/project/:projectId', tasksController.getByProject);
router.get('/:id',               tasksController.getById);
router.post('/',    validate(createTaskSchema), tasksController.create);
router.put('/:id',  validate(updateTaskSchema), tasksController.update);
router.delete('/:id', tasksController.remove);

export default router;
