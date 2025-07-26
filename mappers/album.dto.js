import { buildFileUrl } from '../lib/storage.js';
import { ArtistDTO } from './artist.dto.js';
import { SongDTO } from './song.dto.js';

/**
 * @typedef {import('@prisma/client').albums & { 
 *   songs: Array<{ song: import('@prisma/client').songs }>,
 *   genres: Array<{ genre: import('@prisma/client').genres }> 
 * }} AlbumWithSongsAndGenres
 */

export class AlbumDTO {
  /**
   * Convert a single album object from Prisma to a DTO.
   *
   * @param {AlbumWithSongsAndGenres} album
   * @returns {Object} DTO version of the album
   */
  static from(album) {
    return {
      id: album.id,
      name: album.name,
      description: album.description,
      image: buildFileUrl(album.image),
      artist_id: album.artist_id,
      songs_count: album.songs_count,
      genres_count: album.genres_count,
      total_duration: album.total_duration,
      release_date: album.release_date?.toISOString(),
      is_active: album.is_active,
      is_featured: album.is_featured,
      album_type: album.album_type,
      created_at: album.created_at?.toISOString(),
      updated_at: album.updated_at?.toISOString(),
      songs: album.songs?.map((as) => SongDTO.from(as.song)) || [],
      genres: album.genres?.map((ag) => ag.genre) || [],
      artist: ArtistDTO.from(album.artist)
    };
  }

  /**
   * Convert a list of albums to DTOs.
   *
   * @param {AlbumWithSongsAndGenres[]} albums
   * @returns {Object[]} List of album DTOs
   */
  static fromMany(albums) {
    return albums.map(this.from);
  }
}
