import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { notesService } from './notes.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response';

const createNoteSchema = z.object({
  title: z.string().max(300).optional(),
  content: z.string().optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

const updateNoteSchema = z.object({
  title: z.string().max(300).optional(),
  content: z.string().optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  isPinned: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});

export const notesController = {
  async getNotes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await notesService.getNotes(
        req.userId!,
        req.query as Record<string, string>
      );
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  async getNoteById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const note = await notesService.getNoteById(req.params.id, req.userId!);
      sendSuccess(res, note);
    } catch (error) {
      if ((error as Error).message === 'Note not found') {
        sendError(res, 'Note not found', 404);
        return;
      }
      next(error);
    }
  },

  async createNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = createNoteSchema.safeParse(req.body);
      if (!result.success) {
        sendError(res, 'Validation failed', 400, result.error.flatten().fieldErrors);
        return;
      }

      const note = await notesService.createNote(req.userId!, result.data);
      sendSuccess(res, note, 'Note created', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = updateNoteSchema.safeParse(req.body);
      if (!result.success) {
        sendError(res, 'Validation failed', 400, result.error.flatten().fieldErrors);
        return;
      }

      const note = await notesService.updateNote(
        req.params.id,
        req.userId!,
        result.data
      );
      sendSuccess(res, note, 'Note updated');
    } catch (error) {
      if ((error as Error).message === 'Note not found') {
        sendError(res, 'Note not found', 404);
        return;
      }
      next(error);
    }
  },

  async deleteNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await notesService.deleteNote(req.params.id, req.userId!);
      sendSuccess(res, null, 'Note deleted');
    } catch (error) {
      if ((error as Error).message === 'Note not found') {
        sendError(res, 'Note not found', 404);
        return;
      }
      next(error);
    }
  },

  async generateShareLink(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const shareId = await notesService.generateShareLink(
        req.params.id,
        req.userId!
      );
      sendSuccess(res, { shareId }, 'Share link generated');
    } catch (error) {
      if ((error as Error).message === 'Note not found') {
        sendError(res, 'Note not found', 404);
        return;
      }
      next(error);
    }
  },

  async removeShareLink(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await notesService.removeShareLink(req.params.id, req.userId!);
      sendSuccess(res, null, 'Share link removed');
    } catch (error) {
      if ((error as Error).message === 'Note not found') {
        sendError(res, 'Note not found', 404);
        return;
      }
      next(error);
    }
  },

  async getSharedNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const note = await notesService.getSharedNote(req.params.shareId);
      sendSuccess(res, note);
    } catch (error) {
      if (
        (error as Error).message === 'Shared note not found or no longer public'
      ) {
        sendError(res, 'Note not found or no longer public', 404);
        return;
      }
      next(error);
    }
  },
};