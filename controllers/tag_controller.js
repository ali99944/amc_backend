import { OK_STATUS } from "../lib/status_codes.js";
import Validator from "../lib/validator.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";
import { createTag, deleteTag, getAllTags, updateTag } from "../services/tag_service.js";

export const getAllTagsController = asyncWrapper(
  async (req, res) => {
    const tags = await getAllTags();
    return res.status(OK_STATUS).json(tags);
  }
);

export const createTagController = asyncWrapper(
  async (req, res) => {
    const { name } = req.body;
    await Validator.validateNotNull({ name });
    await Validator.isText(name, { minLength: 2, maxLength: 50 });
    const tag = await createTag({ name });
    return res.status(OK_STATUS).json(tag);
  }
);

export const updateTagController = asyncWrapper(
  async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    await Validator.isNumber(id, { integer: true, min: 1 });
    await Validator.validateNotNull({ name });
    await Validator.isText(name, { minLength: 2, maxLength: 50 });
    const tag = await updateTag({ id, name });
    return res.status(OK_STATUS).json(tag);
  }
);

export const deleteTagController = asyncWrapper(
  async (req, res) => {
    const { id } = req.params;
    // await Validator.isNumber(id, { integer: true, min: 1 });
    await deleteTag(id);
    return res.status(OK_STATUS).json({ message: 'Tag deleted successfully' });
  }
);
