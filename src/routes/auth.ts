import { Router } from 'express';
import { authController } from '../controllers/auht.controller';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../schemas/auth.schemas';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login',    validate(loginSchema),    authController.login);
router.get('/me',        authMiddleware,           authController.me);

export default router;
