import { Response, NextFunction } from 'express';
import { aiService } from './ai.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response';

// Strict rate limit for AI — it's expensive (apply at route level)
export const aiController = {
  async generateSummary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await aiService.generateSummary(
        req.params.id,
        req.userId!
      );
      sendSuccess(res, result, 'Summary generated successfully');
    } catch (error) {
      const message = (error as Error).message;

      if (message === 'Note not found') {
        sendError(res, 'Note not found', 404);
        return;
      }

      if (message === 'Note content is too short to summarize') {
        sendError(res, 'Note content is too short to summarize', 400);
        return;
      }

      if (message === 'AI returned invalid response format') {
        sendError(res, 'AI processing failed, please try again', 500);
        return;
      }

      next(error);
    }
  },
};