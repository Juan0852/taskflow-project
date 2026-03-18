import { Router } from 'express';
import { PreferenceController } from './preference.controller.js';

const router = Router();

router.get('/status', PreferenceController.getStatus);

export { router as preferenceRoutes };
