import { Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response';

export const dashboardController = {
  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await dashboardService.getStats(req.userId!);
      sendSuccess(res, stats, 'Dashboard data fetched');
    } catch (error) {
      next(error);
    }
  },
};