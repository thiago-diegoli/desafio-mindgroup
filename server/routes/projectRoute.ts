import { Router } from 'express';
import { createProject, getAllProjects, getAllProjectsById, updateProject, deleteProject, getProjectById } from '../controllers/projectController';
import { authenticate } from '../middleware/auth';

const router = Router();

// middleware
router.use(authenticate);

router.post('/create', createProject);
router.get('/', getAllProjects);
router.get('/:projectId', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
