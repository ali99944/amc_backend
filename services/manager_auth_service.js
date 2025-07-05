// auth.js
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { admin_web_token_key, json_web_token_expires_in } from '../lib/configs.js';
import { ApiError } from '../lib/api_error.js';
import { NOT_AUTHORIZED_STATUS } from '../lib/status_codes.js';
import { BAD_REQUEST_CODE } from '../lib/error_codes.js';

export const generateToken = async (payload) => {
  return jwt.sign(payload, admin_web_token_key, { expiresIn: json_web_token_expires_in });
};

export const verifyToken = async (token) => {
  try {
    return jwt.verify(token, admin_web_token_key);
  } catch (error) {
    throw new ApiError('Invalid or expired token', BAD_REQUEST_CODE, NOT_AUTHORIZED_STATUS);
  }
};

export const hashPassword = async (password) => {
  return argon2.hash(password);
};

export const verifyPassword = async (hash, password) => {
  return argon2.verify(hash, password);
};