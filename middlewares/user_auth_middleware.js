// user_auth_middleware.js
import {
  verifyUserToken
} from '../lib/user_auth.js';
import {
  ApiError
} from '../lib/api_error.js';
import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import prisma from '../lib/prisma.js';
import {
  BAD_REQUEST_CODE
} from '../lib/error_codes.js';
import {
  NOT_AUTHORIZED_STATUS
} from '../lib/status_codes.js';

export const verifyUserTokenMiddleware = asyncWrapper(
  async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new ApiError('No token provided', BAD_REQUEST_CODE, NOT_AUTHORIZED_STATUS);
    }


    const decoded = await verifyUserToken(token);
    const user = await prisma.users.findUnique({
      where: {
        id: decoded.id
      }
    });
    // if (!user || user.is_banned || !user.is_active || user.deleted_at) {
    //   throw new ApiError('Invalid or inactive user', BAD_REQUEST_CODE, NOT_AUTHORIZED_STATUS);
    // }

    req.user = decoded; // Attach user data to request
    next();
  }
);