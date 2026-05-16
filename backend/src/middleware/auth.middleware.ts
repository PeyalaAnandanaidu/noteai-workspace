import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { sendError } from '../utils/response';

// Extend Express Request to include our user payload
export interface AuthRequest extends Request {
  userId?: string;
}

interface JWTPayload {
  userId: string;
  iat: number;
  exp: number;
}

export function verifyJWT(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'No token provided', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JWTPayload;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(error); // Pass to error handler
  }
}