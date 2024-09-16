import { Router } from 'express';
import { createTask, getAllTasks, getTasksByProject, getTasksByUser, updateTaskStatus, deleteTask } from '../controllers/taskController';
import { authenticate } from '../middleware/auth';
import { taskValidator } from '../validators/taskValidator';

const router = Router();

// middleware
router.use(authenticate);

router.post('/create', taskValidator , createTask);
router.get('/', getAllTasks);
router.get('/project/:id', getTasksByProject);
router.get('/user/:id', getTasksByUser);
router.patch('/status', updateTaskStatus);
router.delete('/:taskId', deleteTask);

export default router;
