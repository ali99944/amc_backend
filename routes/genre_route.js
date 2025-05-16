import express from 'express'
import { createGenreController, deleteGenreController, getAllGenresController, updateGenreController } from '../controllers/genre_controller.js'
import { createMulterStorage } from '../services/multer_storage.js'

const router = express.Router()

router.get('/genres', getAllGenresController)
router.post('/genres', createMulterStorage('images', 'genres').single('image'), createGenreController)
router.put('/genres/:id', createMulterStorage('images', 'genres').single('image'), updateGenreController)

router.delete('/genres/:id', deleteGenreController)


export default router