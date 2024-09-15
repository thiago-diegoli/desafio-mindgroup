import express from 'express';
import { register, login, updateUserPhoto, getUserById, getAllUsers } from '../controllers/loginController';
import { registerValidator, loginValidator } from '../validators/loginValidator';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/', loginValidator, login);
router.put('/users/:userId/photo', authenticate, updateUserPhoto);
router.get('/all/users', authenticate, getAllUsers);
router.get('/users/:id', authenticate, getUserById)
export default router;