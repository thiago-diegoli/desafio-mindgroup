import { Router } from 'express';
import { createTask, getAllTasks, assignTaskOwner, updateTaskStatus, deleteTask } from '../controllers/taskController';
import { authenticate } from '../middleware/auth';

const router = Router();

// middleware
router.use(authenticate);

router.post('/create', createTask);
router.get('/', getAllTasks);
router.patch('/assign', assignTaskOwner);
router.patch('/status', updateTaskStatus);
router.delete('/:taskId', deleteTask);

export default router;
