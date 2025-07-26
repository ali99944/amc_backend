import { buildFileUrl } from '../lib/storage.js';

/**
 * GenreDTO – clean representation of a genre.
 */
export class GenreDTO {
  /**
   * Converts a genre record to DTO.
   * 
   * @param {import('@prisma/client').genres} genre
   */
  static from(genre) {
    return {
      id: genre.id,
      name: genre.name,
      image: buildFileUrl(genre.image),
      description: genre.description,
      color: genre.color,
      total_songs: genre.total_songs,
      is_active: genre.is_active,
      created_at: genre.created_at?.toISOString(),
      updated_at: genre.updated_at?.toISOString(),
    };
  }

  /**
   * Converts an array of genres to DTOs.
   * 
   * @param {import('@prisma/client').genres[]} genres
   */
  static fromMany(genres) {
    return genres.map(this.from);
  }
}
