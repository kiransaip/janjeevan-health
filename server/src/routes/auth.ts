import { Router } from 'express';
import { login, register, deleteAccount } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.delete('/delete-account', authenticate, deleteAccount);

export default router;
