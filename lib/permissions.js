// permissions.js
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
};

export const PERMISSIONS = {
  GENRE: {
    CREATE: 'genre_create',
    READ: 'genre_read',
    UPDATE: 'genre_update',
    // DELETE: 'genre_delete',
  },
  ARTIST: {
    CREATE: 'artist_create',
    READ: 'artist_read',
    UPDATE: 'artist_update',
    DELETE: 'artist_delete',
  },
  SONG: {
    CREATE: 'song_create',
    READ: 'song_read',
    UPDATE: 'song_update',
    DELETE: 'song_delete',
  },
  PLAYLIST: {
    CREATE: 'playlist_create',
    READ: 'playlist_read',
    UPDATE: 'playlist_update',
    DELETE: 'playlist_delete',
  },
  ALBUM: {
    CREATE: 'album_create',
    READ: 'album_read',
    UPDATE: 'album_update',
    DELETE: 'album_delete',
  },
  MANAGER: {
    CREATE: 'manager_create',
    READ: 'manager_read',
    UPDATE: 'manager_update',
    DELETE: 'manager_delete',
  },
};

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    ...Object.values(PERMISSIONS.GENRE),
    ...Object.values(PERMISSIONS.ARTIST),
    ...Object.values(PERMISSIONS.SONG),
    ...Object.values(PERMISSIONS.PLAYLIST),
    ...Object.values(PERMISSIONS.ALBUM),
    ...Object.values(PERMISSIONS.MANAGER),
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.GENRE.CREATE,
    PERMISSIONS.GENRE.READ,
    PERMISSIONS.GENRE.UPDATE,
    PERMISSIONS.GENRE.DELETE,
    PERMISSIONS.ARTIST.CREATE,
    PERMISSIONS.ARTIST.READ,
    PERMISSIONS.ARTIST.UPDATE,
    PERMISSIONS.ARTIST.DELETE,
    PERMISSIONS.SONG.CREATE,
    PERMISSIONS.SONG.READ,
    PERMISSIONS.SONG.UPDATE,
    PERMISSIONS.SONG.DELETE,
    PERMISSIONS.PLAYLIST.CREATE,
    PERMISSIONS.PLAYLIST.READ,
    PERMISSIONS.PLAYLIST.UPDATE,
    PERMISSIONS.PLAYLIST.DELETE,
    PERMISSIONS.ALBUM.CREATE,
    PERMISSIONS.ALBUM.READ,
    PERMISSIONS.ALBUM.UPDATE,
    PERMISSIONS.ALBUM.DELETE,
  ]
};
