import prisma from '../lib/prisma.js';
import promiseAsyncWrapper from '../lib/wrappers/promise_async_wrapper.js';
import { ApiError } from '../lib/api_error.js';
import { BAD_REQUEST_STATUS } from '../lib/status_codes.js';
import { BAD_REQUEST_CODE } from '../lib/error_codes.js';

export const addFavoriteSong = ({ user_id, song_id }) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const song = await prisma.songs.findUnique({ where: { id: song_id } });
    if (!song) {
      throw new ApiError(`Song ID ${song_id} not found`, BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }
    await prisma.user_favorite_songs.upsert({
      where: { user_id_song_id: { user_id, song_id } },
      update: {},
      create: { user_id, song_id },
    });
    resolve();
  })
);

export const removeFavoriteSong = ({ user_id, song_id }) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const favorite = await prisma.user_favorite_songs.findUnique({
      where: { user_id_song_id: { user_id, song_id } },
    });
    if (!favorite) {
      throw new ApiError('Favorite song not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }
    await prisma.user_favorite_songs.delete({
      where: { user_id_song_id: { user_id, song_id } },
    });
    resolve();
  })
);

export const getFavoriteSongs = ({ user_id, limit, offset }) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const favorites = await prisma.user_favorite_songs.findMany({
      where: { user_id },
      include: {
        song: {
          include: {
            artist: true,
            album: true,
            song_genre: { include: { genre: true } },
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: { added_at: 'desc' },
    });

    const mappedSongs = favorites.map(f => ({
      id: f.song.id,
      title: f.song.title,
      artist_id: f.song.artist_id,
      artist_name: f.song.artist.name,
      album_id: f.song.album_id || null,
      album_title: f.song.album?.title || null,
      genre_ids: f.song.song_genre.map(sg => sg.genre_id),
      genre_names: f.song.song_genre.map(sg => sg.genre.name),
      added_at: f.added_at.toISOString(),
    }));

    resolve(mappedSongs);
  })
);

export const addFavoriteArtist = ({ user_id, artist_id }) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const artist = await prisma.artists.findUnique({ where: { id: artist_id } });
    if (!artist) {
      throw new ApiError(`Artist ID ${artist_id} not found`, BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }
    await prisma.user_favorite_artists.upsert({
      where: { user_id_artist_id: { user_id, artist_id } },
      update: {},
      create: { user_id, artist_id },
    });
    resolve();
  })
);

export const removeFavoriteArtist = ({ user_id, artist_id }) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const favorite = await prisma.user_favorite_artists.findUnique({
      where: { user_id_artist_id: { user_id, artist_id } },
    });
    if (!favorite) {
      throw new ApiError('Favorite artist not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }
    await prisma.user_favorite_artists.delete({
      where: { user_id_artist_id: { user_id, artist_id } },
    });
    resolve();
  })
);

export const getFavoriteArtists = ({ user_id, limit, offset }) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const favorites = await prisma.user_favorite_artists.findMany({
      where: { user_id },
      include: { artist: true },
      take: limit,
      skip: offset,
      orderBy: { added_at: 'desc' },
    });

    const mappedArtists = favorites.map(f => ({
      id: f.artist.id,
      name: f.artist.name,
      bio: f.artist.bio,
      image: f.artist.image,
      added_at: f.added_at.toISOString(),
    }));

    resolve(mappedArtists);
  })
);

export const addFavoriteAlbum = ({ user_id, album_id }) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const album = await prisma.albums.findUnique({ where: { id: album_id } });
    if (!album) {
      throw new ApiError(`Album ID ${album_id} not found`, BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }
    await prisma.user_favorite_albums.upsert({
      where: { user_id_album_id: { user_id, album_id } },
      update: {},
      create: { user_id, album_id },
    });
    resolve();
  })
);

export const removeFavoriteAlbum = ({ user_id, album_id }) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const favorite = await prisma.user_favorite_albums.findUnique({
      where: { user_id_album_id: { user_id, album_id } },
    });
    if (!favorite) {
      throw new ApiError('Favorite album not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }
    await prisma.user_favorite_albums.delete({
      where: { user_id_album_id: { user_id, album_id } },
    });
    resolve();
  })
);

export const getFavoriteAlbums = ({ user_id, limit, offset }) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const favorites = await prisma.user_favorite_albums.findMany({
      where: { user_id },
      include: {
        album: {
          include: { artist: true },
        },
      },
      take: limit,
      skip: offset,
      orderBy: { added_at: 'desc' },
    });

    const mappedAlbums = favorites.map(f => ({
      id: f.album.id,
      title: f.album.title,
      artist_id: f.album.artist_id,
      artist_name: f.album.artist.name,
      cover: f.album.cover,
      release_date: f.album.release_date.toISOString(),
      added_at: f.added_at.toISOString(),
    }));

    resolve(mappedAlbums);
  })
);