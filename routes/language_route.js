import express from 'express';
import { getAllLanguagesController, createLanguageController, updateLanguageController, deleteLanguageController } from '../controllers/language_controller.js';

const router = express.Router();

router.get('/languages', getAllLanguagesController);
router.post('/languages', createLanguageController);
router.put('/languages/:id', updateLanguageController);
router.delete('/languages/:id', deleteLanguageController);

export default router;

