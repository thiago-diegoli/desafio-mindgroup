import { Router } from 'express';
import { createProject, getAllProjects, getAllProjectsById, updateProject, deleteProject } from '../controllers/projectController';
import { authenticate } from '../middleware/auth';

const router = Router();

// middleware
router.use(authenticate);

router.post('/create', createProject);
router.get('/', getAllProjects);
router.get('/:id', getAllProjectsById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
