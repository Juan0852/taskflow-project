import { Router } from 'express';
import { PreferenceController } from './preference.controller.js';
import { requireAuth } from '../../middlewares/require-auth.middleware.js';

const router = Router();

router.get('/status', PreferenceController.getStatus);
router.use(requireAuth);
router.get('/', PreferenceController.getMine);
router.patch('/', PreferenceController.updateMine);

export { router as preferenceRoutes };
