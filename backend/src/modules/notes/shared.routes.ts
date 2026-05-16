import { Router } from 'express';
import { notesController } from './notes.controller';

const router = Router();

// Public route — no auth required
router.get('/:shareId', notesController.getSharedNote);

export default router;