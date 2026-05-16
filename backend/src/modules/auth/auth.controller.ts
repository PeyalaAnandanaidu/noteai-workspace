import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from './auth.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

// Input validation schemas using Zod
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const authController = {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const result = signupSchema.safeParse(req.body);
      if (!result.success) {
        sendError(res, 'Validation failed', 400, result.error.flatten().fieldErrors);
        return;
      }

      const data = await authService.signup(result.data);
      sendSuccess(res, data, 'Account created successfully', 201);
    } catch (error) {
      if ((error as Error).name === 'ConflictError') {
        sendError(res, (error as Error).message, 409);
        return;
      }
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        sendError(res, 'Validation failed', 400, result.error.flatten().fieldErrors);
        return;
      }

      const data = await authService.login(result.data);
      sendSuccess(res, data, 'Login successful');
    } catch (error) {
      if ((error as Error).message === 'Invalid email or password') {
        sendError(res, 'Invalid email or password', 401);
        return;
      }
      next(error);
    }
  },

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.userId!);
      sendSuccess(res, user, 'User fetched successfully');
    } catch (error) {
      next(error);
    }
  },
};