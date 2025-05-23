import rateLimit from 'express-rate-limit';
import { TOO_MANY_REQUESTS_STATUS } from '../lib/status_codes.js';

const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again after 15 minutes',
      code: 'TOO_MANY_REQUESTS',
    },
  },
  statusCode: TOO_MANY_REQUESTS_STATUS,
});

// More specific limiters can be created for sensitive endpoints
const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 10 requests per windowMs for auth routes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts from this IP, please try again after 10 minutes',
      code: 'TOO_MANY_AUTH_REQUESTS',
    },
  },
  statusCode: TOO_MANY_REQUESTS_STATUS,
});

export { generalRateLimiter, authRateLimiter };