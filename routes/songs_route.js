import express from "express"
import { createSongController, deleteSongController, getAllSongsController, getArtistSongsController, updateSongController } from "../controllers/song_controller.js"
import { createMulterStorage } from "../services/multer_storage.js"

const router = express.Router()

router.get('/songs', getAllSongsController)
router.post('/songs', createMulterStorage('audios', 'songs').single('audio'), createSongController)


router.put('/songs/:id', createMulterStorage('audios', 'songs').single('audio'), updateSongController)
router.delete('/songs/:id', deleteSongController)


router.get('/artists/:id/songs', getArtistSongsController)

export default router