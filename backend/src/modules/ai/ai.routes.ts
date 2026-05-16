import { Router } from 'express';
import { verifyJWT } from '../../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';

// Dedicated rate limiter for AI endpoints
// 20 AI requests per hour per IP
const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: 'AI rate limit exceeded. Please try again in an hour.',
});

const router = Router();
router.use(verifyJWT, aiRateLimiter);

// Routes are registered on notes router directly
// This file exists for future standalone AI endpoints

export default router;