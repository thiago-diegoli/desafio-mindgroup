import express from 'express';
import { register, login, updateUserPhoto, getUserById, getAllUsers } from '../controllers/loginController';
import { registerValidator, loginValidator, updateUserPhotoValidator, getUserByIdValidator } from '../validators/loginValidator';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/', loginValidator, login);
router.put('/users/:userId/photo', authenticate, updateUserPhotoValidator, updateUserPhoto);
router.get('/all/users', authenticate, getAllUsers);
router.get('/users/:id', authenticate, getUserByIdValidator, getUserById);

export default router;
