import multer, { diskStorage } from 'multer';
import path from 'path';
import Randomstring from 'randomstring'

const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/audios/'); 
    },
    filename: function (req, file, cb) {
        cb(null, 'audio_' + Randomstring.generate(10) + path.extname(file.originalname.replace(/\s/g, '')));
    }
});

const audio_upload = multer({ storage: storage });

export default audio_upload