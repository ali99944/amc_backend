// manager_auth_controller.js
import { ApiError } from "../lib/api_error.js";
import { BAD_REQUEST_CODE } from "../lib/error_codes.js";
import { BAD_REQUEST_STATUS, NOT_AUTHORIZED_STATUS, OK_STATUS } from "../lib/status_codes.js";
import Validator from "../lib/validator.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";
import { generateToken, verifyPassword, verifyToken } from "../services/manager_auth_service.js";
import prisma from "../lib/prisma.js";

export const loginManagerController = asyncWrapper(
  async (req, res, next) => {
    const { username, password } = req.body;

    // Validate inputs
    await Validator.validateNotNull({ username, password });
    // await Validator.isPassword(password);

    const manager = await prisma.managers.findUnique({ where: { username } });
    if (!manager) {
      throw new ApiError("Invalid username or password", BAD_REQUEST_CODE, NOT_AUTHORIZED_STATUS);
    }

    const isValidPassword = await verifyPassword(manager.password, password);
    if (!isValidPassword) {
      throw new ApiError("Invalid username or password", BAD_REQUEST_CODE, NOT_AUTHORIZED_STATUS);
    }

    if (!manager.is_active) {
      throw new ApiError("Manager account is deactivated", BAD_REQUEST_CODE, NOT_AUTHORIZED_STATUS);
    }

    const token = await generateToken({
      id: manager.id,
      username: manager.username,
      role: manager.role,
    });

    return res.status(OK_STATUS).json({
      token,
      manager: {
        id: manager.id.toString(),
        username: manager.username,
        name: manager.name,
        role: manager.role,
        is_active: manager.is_active,
        created_at: manager.created_at.toISOString(),
      },
    });
  }
);

export const logoutManagerController = asyncWrapper(
  async (req, res) => {
    // In a stateless JWT system, logout is client-side (discard token)
    return res.status(OK_STATUS).json({ message: "Logged out successfully" });
  }
);

export const refreshTokenController = asyncWrapper(
  async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
      throw new ApiError("Token is required", BAD_REQUEST_STATUS, BAD_REQUEST_CODE);
    }

    const decoded = await verifyToken(token);
    const manager = await prisma.managers.findUnique({ where: { id: decoded.id } });
    if (!manager || !manager.is_active) {
      throw new ApiError("Invalid or inactive manager", NOT_AUTHORIZED_STATUS, BAD_REQUEST_CODE);
    }

    const newToken = await generateToken({
      id: manager.id,
      email: manager.email,
      role: manager.role,
    });

    return res.status(OK_STATUS).json({ token: newToken });
  }
);


export const verifyManagerTokenController = asyncWrapper(
  async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
      throw new ApiError("Token is required", BAD_REQUEST_STATUS, BAD_REQUEST_CODE);
    }

    const decoded = await verifyToken(token);
    const manager = await prisma.managers.findUnique({ where: { id: decoded.id } });

    if (!manager || !manager.is_active) {
      throw new ApiError("Invalid or inactive manager", NOT_AUTHORIZED_STATUS, BAD_REQUEST_CODE);
    }

    return res.status(OK_STATUS).json({ 
      valid: true,
      manager: {
        id: manager.id.toString(),
        email: manager.email,
        name: manager.name,
        role: manager.role,
        is_active: manager.is_active
      }
    });
  }
);

export const getCurrentManagerController = asyncWrapper(
  async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new ApiError("Token is required", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }

    console.log(token);
    const decoded = await verifyToken(token);
    console.log(decoded);
    
    const manager = await prisma.managers.findUnique({ 
      where: { id: decoded.id }
    });

    if (!manager || !manager.is_active) {
      throw new ApiError("Manager not found or inactive", BAD_REQUEST_CODE, NOT_AUTHORIZED_STATUS);
    }

    return res.status(OK_STATUS).json({
      manager: {
        id: manager.id.toString(),
        email: manager.email,
        name: manager.name,
        role: manager.role,
        is_active: manager.is_active,
        created_at: manager.created_at.toISOString()
      }
    });
  }
);
