import { ApiError } from "../lib/api_error.js";
import { BAD_REQUEST_CODE } from "../lib/error_codes.js";
import { BAD_REQUEST_STATUS, OK_STATUS } from "../lib/status_codes.js";
import Validator from "../lib/validator.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";
import { createLanguage, deleteLanguage, getAllLanguages, updateLanguage } from "../services/language_service.js";

export const getAllLanguagesController = asyncWrapper(
    async (_, res) => {
        const languages = await getAllLanguages();
        return res.status(OK_STATUS).json(languages);
    }
);

export const createLanguageController = asyncWrapper(
    async (req, res) => {
        const { name, code } = req.body;
        await Validator.validateNotNull({ name, code });
        await Validator.isText(name, { minLength: 2, maxLength: 50 });
        await Validator.isText(code, { minLength: 2, maxLength: 5, regex: /^[a-zA-Z]+$/ });
        const language = await createLanguage({ name, code });
        return res.status(OK_STATUS).json(language);
    }
);

export const updateLanguageController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        const { name, code } = req.body;
        await Validator.isNumber(id, { integer: true, min: 1 });
        await Validator.validateNotNull({ name, code });
        await Validator.isText(name, { minLength: 2, maxLength: 50 });
        await Validator.isText(code, { minLength: 2, maxLength: 5, regex: /^[a-zA-Z]+$/ });
        const language = await updateLanguage({ id, name, code });
        return res.status(OK_STATUS).json(language);
    }
);

export const deleteLanguageController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        await Validator.isNumber(id, { integer: true, min: 1 });
        await deleteLanguage(id);
        return res.status(OK_STATUS).json({ message: "Language deleted successfully" });
    }
);
