import { Router } from 'express';
import { UserController } from './user.controller.js';

const router = Router();

router.get('/status', UserController.getStatus);

export { router as userRoutes };
