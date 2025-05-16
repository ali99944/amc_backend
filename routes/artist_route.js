import express from 'express'
import { createArtistController, deleteArtistController, followArtistController, getAllArtistsController, getArtistController, unfollowArtistController, updateArtistController } from '../controllers/artist_controller.js'
import { createMulterStorage } from '../services/multer_storage.js'

const router = express.Router()


router.get('/artists', getAllArtistsController)
router.get('/artists/:id', getArtistController)
router.post('/artists', createMulterStorage('images', 'artists').single('image'), createArtistController)
router.put('/artists/:id', createMulterStorage('images', 'artists').single('image'), updateArtistController)
router.delete('/artists/:id', deleteArtistController)

router.post('/artists/:id/follow', followArtistController)
router.post('/artists/:id/unfollow', unfollowArtistController)



export default router