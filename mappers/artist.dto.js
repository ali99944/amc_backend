import { buildFileUrl } from '../lib/storage.js';
import { GenreDTO } from './genre.dto.js';

/**
 * ArtistDTO – minimal and clean artist response.
 */
export class ArtistDTO {
  /**
   * Convert an artist object from Prisma into a DTO.
   *
   * @param {import('@prisma/client').artists & {
   *   genres?: ({
   *     genre: import('@prisma/client').genres
   *   })[]
   * }} artist
   */
  static from(artist) {
    return {
      id: artist.id,
      name: artist.name,
      image: buildFileUrl(artist.image),
      bio: artist.bio,
      is_featured: artist.is_featured,
      is_active: artist.is_active,
      followers_count: artist.followers_count,
      created_at: artist.created_at?.toISOString(),
      updated_at: artist.updated_at?.toISOString(),
      genres: artist.genres?.map((g) => GenreDTO.from(g.genre)) ?? [],
    };
  }

  /**
   * Convert an array of artists to DTOs.
   *
   * @param {Array<import('@prisma/client').artists>} artists
   * @returns {Array<Object>}
   */
  static fromMany(artists) {
    return artists.map(this.from);
  }
}
