import { Router } from 'express';
import { authController } from './auth.controller';
import { verifyJWT } from '../../middleware/auth.middleware';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', verifyJWT, authController.me);

export default router;