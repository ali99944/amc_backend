// contact_messages_controller.js
import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import { getContactMessages, createContactMessage, deleteContactMessage } from '../services/contact_messages_service.js';
import { OK_STATUS, CREATED_STATUS } from '../lib/status_codes.js';
import Validator from '../lib/validator.js';

export const getContactMessagesController = asyncWrapper(async (req, res) => {
  const messages = await getContactMessages();
  return res.status(OK_STATUS).json(messages);
});

export const createContactMessageController = asyncWrapper(async (req, res) => {
  const { name, email, subject, message } = req.body;
  await Validator.validateNotNull({ name, email, subject, message })
  const created_message = await createContactMessage({
    name, email, subject, message
  });
  return res.status(CREATED_STATUS).json(created_message);
});

export const deleteContactMessageController = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  await deleteContactMessage(parseInt(id));
  return res.status(OK_STATUS).json({ message: 'Contact message deleted successfully' });
});

