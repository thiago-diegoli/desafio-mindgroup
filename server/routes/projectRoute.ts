import { Router } from 'express';
import { createProject, getAllProjects, getAllProjectsById } from '../controllers/projectController';

const router = Router();

router.post('/create', createProject);
router.get('/', getAllProjects);
router.get('/:id', getAllProjectsById)

export default router;