// Consistent API response format across the entire app
// Every endpoint returns the same shape — easy to handle on frontend

import { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: unknown
): void {
  res.status(statusCode).json({
    success: false,
    message,
    errors: errors || null,
  });
}