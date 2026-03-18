import { Router } from 'express';
import { AuthController } from './auth.controller.js';

const router = Router();

router.get('/status', AuthController.getStatus);
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', AuthController.me);
router.post('/logout', AuthController.logout);

export { router as authRoutes };
