export class SongDTO {
  /**
   * Creates a new SongDTO from a Prisma song object.
   *
   * @param {import('@prisma/client').songs} song
   */
  constructor(song) {
    this.id = song.id;
    this.title = song.title;
    this.description = song.description;
    this.cover_image = song.image;
    this.lyrics = song.lyrics;
    this.original_audio = song.original_audio
    this.artist = song.artist;
    this.genre = song.genre;
    this.track_number = song.track_number;
    this.is_active = song.is_active;
    this.release_date = song.release_date;
    this.created_at = song.created_at?.toISOString();
  }
}
