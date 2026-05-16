import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { verifyJWT } from '../../middleware/auth.middleware';

const router = Router();

router.use(verifyJWT);
router.get('/', dashboardController.getStats);

export default router;