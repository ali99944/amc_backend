// manager_auth_middleware.js
import { verifyToken } from '../services/manager_auth_service.js';
import { ApiError } from '../lib/api_error.js';
import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import { BAD_REQUEST_CODE } from '../lib/error_codes.js';
import { NOT_AUTHORIZED_STATUS } from '../lib/status_codes.js';

export const verifyManagerToken = asyncWrapper(
  async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new ApiError('No token provided', BAD_REQUEST_CODE, NOT_AUTHORIZED_STATUS);
    }

    const decoded = await verifyToken(token);
    req.manager = decoded; // Attach manager data to request
    next();
  }
);

export const restrictTo = (...requiredPermissions) => asyncWrapper(
  async (req, res, next) => {
    const managerPermissions = req.manager.manager_permissions || [];

    const isSuperAdmin = req.manager.role == 'super_admin';
    
    const hasPermission = isSuperAdmin || requiredPermissions.every(perm => managerPermissions.some(p => p.name === perm));
    if (!hasPermission) {
      return next(new ApiError('Insufficient permissions', BAD_REQUEST_CODE, NOT_AUTHORIZED_STATUS));
    }

    next();
  }
);
