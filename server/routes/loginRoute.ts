import express from 'express';
import { register, login, updateUserPhoto, getUserById } from '../controllers/loginController';
import { registerValidator, loginValidator } from '../validators/loginValidator';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/', loginValidator, login);
router.put('/users/:userId/photo', updateUserPhoto);
router.get('/users/:userId', getUserById);

export default router;