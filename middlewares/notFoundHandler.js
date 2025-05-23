import { NOT_FOUND_STATUS } from '../lib/status_codes.js';
import { NOT_FOUND_CODE } from '../lib/error_codes.js';

const notFoundHandler = (req, res, next) => {
  res.status(NOT_FOUND_STATUS).json({
    success: false,
    error: {
      message: `Not Found - ${req.originalUrl}`,
      code: NOT_FOUND_CODE,
    },
  });
};

export default notFoundHandler;