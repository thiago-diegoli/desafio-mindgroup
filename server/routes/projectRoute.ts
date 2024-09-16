import { Router } from 'express';
import { createProject, getAllProjects, getAllProjectsById, updateProject, deleteProject, getProjectById } from '../controllers/projectController';
import { authenticate } from '../middleware/auth';
import { projectValidator } from '../validators/projectValidator';

const router = Router();

// middleware
router.use(authenticate);

router.post('/create', projectValidator, createProject);
router.get('/', getAllProjects);
router.get('/:projectId', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
