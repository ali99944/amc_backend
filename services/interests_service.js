import prisma from '../lib/prisma.js';
import promiseAsyncWrapper from '../lib/wrappers/promise_async_wrapper.js';
import { ApiError } from '../lib/api_error.js';
import { BAD_REQUEST_STATUS } from '../lib/status_codes.js';
import { BAD_REQUEST_CODE } from '../lib/error_codes.js';

export const addGenreInterests = ({ user_id, genre_ids }) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    for (const genre_id of genre_ids) {
      const genre = await prisma.genres.findUnique({ where: { id: genre_id } });
      if (!genre) {
        throw new ApiError(`Genre ID ${genre_id} not found`, BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }
      await prisma.user_genre_interests.upsert({
        where: { user_id_genre_id: { user_id, genre_id } },
        update: {},
        create: { user_id, genre_id },
      });
    }
    resolve();
  })
);

export const removeGenreInterest = ({ user_id, genre_id }) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const interest = await prisma.user_genre_interests.findUnique({
      where: { user_id_genre_id: { user_id, genre_id } },
    });
    if (!interest) {
      throw new ApiError('Genre interest not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }
    await prisma.user_genre_interests.delete({
      where: { user_id_genre_id: { user_id, genre_id } },
    });
    resolve();
  })
);

export const getGenreInterests = ({ user_id, limit, offset }) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const interests = await prisma.user_genre_interests.findMany({
      where: { user_id },
      include: { genre: true },
      take: limit,
      skip: offset,
      orderBy: { added_at: 'desc' },
    });

    const mappedGenres = interests.map(i => ({
      id: i.genre.id,
      name: i.genre.name,
      image: i.genre.image,
      added_at: i.added_at.toISOString(),
    }));

    resolve(mappedGenres);
  })
);

export const addArtistInterests = ({ user_id, artist_ids }) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    for (const artist_id of artist_ids) {
      const artist = await prisma.artists.findUnique({ where: { id: artist_id } });
      if (!artist) {
        throw new ApiError(`Artist ID ${artist_id} not found`, BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }
      await prisma.user_artist_interests.upsert({
        where: { user_id_artist_id: { user_id, artist_id } },
        update: {},
        create: { user_id, artist_id },
      });
    }
    resolve();
  })
);

export const removeArtistInterest = ({ user_id, artist_id }) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const interest = await prisma.user_artist_interests.findUnique({
      where: { user_id_artist_id: { user_id, artist_id } },
    });
    if (!interest) {
      throw new ApiError('Artist interest not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }
    await prisma.user_artist_interests.delete({
      where: { user_id_artist_id: { user_id, artist_id } },
    });
    resolve();
  })
);

export const getArtistInterests = ({ user_id, limit, offset }) => new Promise(
  promiseAsyncWrapper(async (resolve) => {
    const interests = await prisma.user_artist_interests.findMany({
      where: { user_id },
      include: { artist: true },
      take: limit,
      skip: offset,
      orderBy: { added_at: 'desc' },
    });

    const mappedArtists = interests.map(i => ({
      id: i.artist.id,
      name: i.artist.name,
      bio: i.artist.bio,
      image: i.artist.image,
      added_at: i.added_at.toISOString(),
    }));

    resolve(mappedArtists);
  })
);