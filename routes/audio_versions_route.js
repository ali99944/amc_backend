import { Router } from "express"
import { createMulterStorage } from "../services/multer_storage.js"


const router = Router()

const audio_storage = createMulterStorage('audios','versions')

router.get('/songs/:id/audio-versions')
router.post('audio-versions', audio_storage.single('image'))
router.delete('audio-versions/:id')

export default router