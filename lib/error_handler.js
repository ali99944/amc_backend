import { INTERNAL_SERVER_ERROR_CODE } from "./error_codes.js";

function errorHandler(err, req, res, next) {
    // Default to 500 if no status code is set
    const status = err.status || 500;
    const response = {
      success: false,
      error: {
        message: err.message || "Internal server error",
        code: err.code || INTERNAL_SERVER_ERROR_CODE,
        ...(err.details && { details: err.details }), // Only include if present
      },
    };
    res.status(status).json(response);
}

export default errorHandler