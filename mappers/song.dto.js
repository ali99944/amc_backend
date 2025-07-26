import { buildFileUrl } from '../lib/storage.js'
import { ArtistDTO } from './artist.dto.js'
import { AudioDTO } from './audio.dto.js'

export class SongDTO {

    /**
   * Creates a new SongDTO from a Prisma song object.
   *
   * @param {import('@prisma/client').songs & {
   *    original_audio: import('@prisma/client').audio
   * }} song
   */
  static from(song) {
    console.log(song);
    
    return {
      id: song.id,
      title: song.title,
      description: song.description,
      image: buildFileUrl(song.image),
      lyrics: song.lyrics,
      artist: song.artist ? ArtistDTO.from(song.artist) : undefined,
      artist_id: song.artist_id,
      original_audio: song.original_audio ? AudioDTO.from(song.original_audio) : undefined,
      genre: song.genre,
      track_number: song.track_number,
      is_active: song.is_active,
      release_date: song.release_date,
      play_count: song.play_count,
      created_at: song.created_at?.toISOString(),
      is_explicit: song.is_explicit,
      is_downloadable: song.is_downloadable
    }
  }

  static fromMany(songs) {
    return songs.map(SongDTO.from)
  }
}
