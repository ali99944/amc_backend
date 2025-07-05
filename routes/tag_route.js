// tag_route.js
import express from 'express';
import {
  getAllTagsController,
  createTagController,
  updateTagController,
  deleteTagController,
} from '../controllers/tag_controller.js';

const router = express.Router();

router.get('/tags', getAllTagsController);
router.post('/tags', createTagController);
router.put('/tags/:id', updateTagController);
router.delete('/tags/:id', deleteTagController);

export default router;
