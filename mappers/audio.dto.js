import { buildFileUrl } from '../lib/storage.js';

export class AudioDTO {
    /**
     * 
     * @param {import('@prisma/client').audio} audio 
     * @returns 
     */
    static from(audio) {
        return {
            id: audio.id,
            filepath: buildFileUrl(audio.file_path),
            format: audio.format,
            filesize: audio.file_size,
            duration: audio.duration,
            bitrate: audio.bitrate,
            created_at: audio.created_at,
            updated_at: audio.updated_at
        }
    }
}