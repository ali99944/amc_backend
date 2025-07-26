import { AlbumDTO } from "./album.dto.js";
import { ArtistDTO } from "./artist.dto.js";
import { SongDTO } from "./song.dto.js";

/**
 * ArtistProfileDTO – minimal and clean artist response.
 */
export class ArtistProfileDTO {
  static from({ artist, top_tracks, related_artists, albums }) {
    return {
      artist: ArtistDTO.from(artist),
      related_artists: ArtistDTO.fromMany(related_artists),
      albums: AlbumDTO.fromMany(albums),
      top_tracks: SongDTO.fromMany(top_tracks)
    };
  }
}
