// manager_service.js
import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";
import { ApiError } from "../lib/api_error.js";
import { BAD_REQUEST_STATUS } from "../lib/status_codes.js";
import { hashPassword } from "./manager_auth_service.js";
import { BAD_REQUEST_CODE } from "../lib/error_codes.js";

export const getAllManagers = async () => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const managers = await prisma.managers.findMany({
        include: {
          manager_permissions: true
        }
      });

      // Map to interface
      const mappedManagers = managers.map(manager => ({
        id: manager.id,
        username: manager.username,
        name: manager.name,
        role: manager.role,
        is_active: manager.is_active,
        created_at: manager.created_at,
        updated_at: manager.updated_at,
        last_login: (new Date()).toISOString,

        manager_permissions: manager.manager_permissions
      }));

      return resolve(mappedManagers);
    }
  )
);

export const createManager = async ({ email, password, name, role }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      // Check if email is unique
      const existingManager = await prisma.managers.findUnique({ where: { email } });
      if (existingManager) {
        throw new ApiError("Email already exists", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      const hashedPassword = await hashPassword(password);

      const manager = await prisma.managers.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
          is_active: true,
        },
      });

      // Map to interface
      const mappedManager = {
        id: manager.id,
        email: manager.email,
        name: manager.name,
        role: manager.role,
        is_active: manager.is_active,
        created_at: manager.created_at.toISOString(),
      };

      return resolve(mappedManager);
    }
  )
);

export const deleteManager = async (id) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const manager = await prisma.managers.findUnique({ where: { id: +id } });
      if (!manager) {
        throw new ApiError("Manager not found", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      const deletedManager = await prisma.managers.delete({ where: { id: +id } });

      // Map to interface
      const mappedManager = {
        id: deletedManager.id,
        email: deletedManager.email,
        name: deletedManager.name,
        role: deletedManager.role,
        is_active: deletedManager.is_active,
        created_at: deletedManager.created_at.toISOString(),
      };

      return resolve(mappedManager);
    }
  )
);

export const updateManager = async ({ id, payload }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const { email, password, name, role, is_active } = payload;

      // Check if email is unique (if provided)
      if (email) {
        const existingManager = await prisma.managers.findUnique({ where: { email } });
        if (existingManager && existingManager.id !== +id) {
          throw new ApiError("Email already exists", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
        }
      }

      const data = {};
      if (email) data.email = email;
      if (password) data.password = await hashPassword(password);
      if (name) data.name = name;
      if (role) data.role = role;
      if (is_active !== undefined) data.is_active = is_active;

      const manager = await prisma.managers.update({
        where: { id: +id },
        data,
      });

      // Map to interface
      const mappedManager = {
        id: manager.id,
        email: manager.email,
        name: manager.name,
        role: manager.role,
        is_active: manager.is_active,
        created_at: manager.created_at.toISOString(),
      };

      return resolve(mappedManager);
    }
  )
);