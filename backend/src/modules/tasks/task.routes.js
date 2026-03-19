import { Router } from 'express';
import { TaskController } from './task.controller.js';
import { requireAuth } from '../../middlewares/require-auth.middleware.js';

const router = Router();

router.get('/status', TaskController.getStatus);
router.use(requireAuth);

router.get('/', TaskController.list);
router.get('/trash', TaskController.listTrash);
router.get('/types', TaskController.getTypes);
router.post('/', TaskController.create);
router.patch('/bulk/complete-all', TaskController.completeAll);
router.patch('/bulk/trash-completed', TaskController.trashCompleted);
router.delete('/bulk/delete-trash', TaskController.emptyTrash);
router.patch('/:id', TaskController.update);
router.patch('/:id/trash', TaskController.trash);
router.patch('/:id/restore', TaskController.restore);
router.delete('/:id', TaskController.remove);

export { router as taskRoutes };
