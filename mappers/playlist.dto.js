import { buildFileUrl } from '../lib/storage.js';
import { SongDTO } from './song.dto.js';

/**
 * @typedef {import('@prisma/client').playlists & { songs: Array<{ song: import('@prisma/client').songs }> }} PlaylistWithSongs
 */

export class PlaylistDTO {
  /**
   * Convert a single playlist object from Prisma to a DTO.
   *
   * @param {PlaylistWithSongs} playlist
   * @returns {Object} DTO version of the playlist
   */
  static from(playlist) {
    return {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      cover_image: playlist.image != null ? buildFileUrl(playlist.image) : undefined,
      type: playlist.type,
      source: playlist.source ?? 'unknown',
      created_at: playlist.createdAt?.toISOString(),
      updated_at: playlist.updatedAt?.toISOString(),
      songs: playlist.songs?.map((ps) => SongDTO.from(ps.song)) || []
    };
  }

  /**
   * Convert a list of playlists to DTOs.
   *
   * @param {PlaylistWithSongs[]} playlists
   * @returns {Object[]} List of playlist DTOs
   */
  static fromMany(playlists) {
    return playlists.map(this.from);
  }

  /**
   * Special case: generate a "Liked Songs" playlist
   *
   * @returns {Object}
   */
  static constructVirtualPlaylist({
    songs_list,
    playlist_name,
    playlist_description,
    type = 'user'
  }) {
    return {
      id: 0, // could be a string identifier
      name: playlist_name,
      description: playlist_description,
      type: type,
      source: 'virtual',
      user_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      songs: SongDTO.fromMany(songs_list)
    };
  }
}
