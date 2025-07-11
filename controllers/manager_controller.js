
import Validator from "../lib/validator.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";
import { createManager, deleteManager, getAllManagers, updateManager } from "../services/manager_service.js";
import { ROLES } from "../lib/permissions.js";
import { OK_STATUS } from "../lib/status_codes.js";

export const getAllManagersController = asyncWrapper(
  async (_, res) => {
    const managers = await getAllManagers();
    return res.status(OK_STATUS).json(managers);
  }
);

export const createManagerController = asyncWrapper(
  async (req, res, next) => {
    const { username, password, name, role } = req.body;

    // Validate inputs
    await Validator.validateNotNull({ username, password, name });
    await Validator.isText(name, { minLength: 2, maxLength: 100 });
    await Validator.isPassword(password);
    if (role) {
      await Validator.isEnum(role, Object.values(ROLES), `Role must be one of: ${Object.values(ROLES).join(', ')}`);
    }

    const manager = await createManager({
      username,
      password,
      name,
      role: role || ROLES.STAFF, // Default to staff
    });

    return res.status(OK_STATUS).json(manager);
  }
);

export const deleteManagerController = asyncWrapper(
  async (req, res) => {
    const { id } = req.params;
    await Validator.isNumber(id, { integer: true, min: 1 });
    const deletedManager = await deleteManager(id);
    return res.status(OK_STATUS).json(deletedManager);
  }
);

export const updateManagerController = asyncWrapper(
  async (req, res) => {
    const { id } = req.params;
    const { email, password, name, role, is_active } = req.body;

    // Validate inputs
    await Validator.isNumber(id, { integer: true, min: 1 });
    if (email) await Validator.isEmail(email);
    if (name) await Validator.isText(name, { minLength: 2, maxLength: 100 });
    if (password) await Validator.isPassword(password);
    if (role) {
      await Validator.isEnum(role, Object.values(ROLES), `Role must be one of: ${Object.values(ROLES).join(', ')}`);
    }
    if (is_active !== undefined) {
      await Validator.isEnum(is_active, [true, false], "is_active must be a boolean");
    }

    const updatedManager = await updateManager({
      id,
      payload: {
        email,
        password,
        name,
        role,
        is_active,
      },
    });

    return res.status(OK_STATUS).json(updatedManager);
  }
);