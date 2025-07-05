import express from 'express';
import { getContactMessagesController, deleteContactMessageController, createContactMessageController } from '../controllers/contact_messages_controller.js';
import { verifyManagerToken } from '../middlewares/manager_auth_middleware.js';

const router = express.Router();

router.post('/contact-messages', createContactMessageController);

// Manager-only routes
router.get('/contact-messages', verifyManagerToken, getContactMessagesController);
router.delete('/contact-messages/:id', verifyManagerToken, deleteContactMessageController);

export default router;
