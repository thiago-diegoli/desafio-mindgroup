import express from 'express';
import { register, login } from '../controllers/loginController';
import { registerValidator, loginValidator } from '../validators/loginValidator';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/', loginValidator, login);

export default router;