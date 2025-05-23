import { ApiError } from '../lib/api_error.js';
import { INTERNAL_SERVER_ERROR_CODE } from '../lib/error_codes.js';
import logger from '../lib/logger.js';
import { INTERNAL_SERVER_STATUS } from '../lib/status_codes.js';

const globalErrorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    logger.error({
      message: err.message,
      code: err.code,
      status: err.status,
      details: err.details,
      stack: err.stack,
    });
    return res.status(err.status || INTERNAL_SERVER_STATUS).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        ...(err.details && { details: err.details }),
      },
    });
  }

  logger.error({
    message: err.message || 'Internal Server Error',
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  return res.status(INTERNAL_SERVER_STATUS).json({
    success: false,
    error: {
      message: 'Internal Server Error',
      code: INTERNAL_SERVER_ERROR_CODE,
    },
  });
};

export default globalErrorHandler;