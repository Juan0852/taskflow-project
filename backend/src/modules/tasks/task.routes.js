import { Router } from 'express';
import { TaskController } from './task.controller.js';

const router = Router();

router.get('/status', TaskController.getStatus);

export { router as taskRoutes };
