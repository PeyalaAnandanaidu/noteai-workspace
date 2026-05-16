import { Router } from 'express';
import { notesController } from './notes.controller';
import { verifyJWT } from '../../middleware/auth.middleware';
import { aiController } from '../ai/ai.controller';

const router = Router();

// All notes routes require authentication
router.use(verifyJWT);

router.get('/', notesController.getNotes);
router.post('/', notesController.createNote);
router.get('/:id', notesController.getNoteById);
router.patch('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

// Share management
router.post('/:id/share', notesController.generateShareLink);
router.delete('/:id/share', notesController.removeShareLink);

// AI (on notes router for semantic URL /notes/:id/generate-summary)
router.post('/:id/generate-summary', aiController.generateSummary);

export default router;