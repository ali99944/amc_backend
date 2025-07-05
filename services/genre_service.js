import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";

// genre_service.js
export const getAllGenres = async () => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const genres = await prisma.genres.findMany({
            });

            // Map to interface
            const mappedGenres = genres.map(genre => ({
                id: genre.id,
                name: genre.name,
                description: genre.description || '',
                image: genre.image,
                color: genre.color || '#000000', // Default color if not set
                // songs_count: genre.total_songs,
                // artists_count: genre.artist_genres.length,
                created_at: genre.created_at.toISOString(),
                is_active: genre.is_active,
            }));

            return resolve(mappedGenres);
        }
    )
);

export const createGenre = async ({ name, description, image, color }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const genre = await prisma.genres.create({
                data: {
                    name,
                    description,
                    image,
                    color,
                    is_active: true,
                },
            });

            // Map to interface
            const mappedGenre = {
                id: genre.id,
                name: genre.name,
                description: genre.description || '',
                image: genre.image,
                color: genre.color || '#000000',
                songs_count: genre.total_songs,
                artists_count: 0, // New genre has no artists initially
                created_at: genre.created_at.toISOString(),
                is_active: genre.is_active,
            };

            return resolve(mappedGenre);
        }
    )
);

export const deleteGenre = async (id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const genre = await prisma.genres.delete({
                where: {
                    id: +id,
                },
            });

            return resolve({
                id: genre.id,
                name: genre.name,
                description: genre.description || '',
                image: genre.image,
                color: genre.color || '#000000',
                songs_count: genre.total_songs,
                artists_count: 0, // No need to compute as it's deleted
                created_at: genre.created_at.toISOString(),
                is_active: genre.is_active,
            });
        }
    )
);

export const updateGenre = async ({ id, payload }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const genre = await prisma.genres.update({
                where: {
                    id: +id,
                },
                data: {
                    name: payload.name,
                    description: payload.description,
                    image: payload.image ?? undefined,
                    color: payload.color ?? undefined,
                    is_active: payload.is_active ?? undefined,
                },
                include: {
                    artist_genres: true, // To compute artists_count
                },
            });

            // Map to interface
            const mappedGenre = {
                id: genre.id,
                name: genre.name,
                description: genre.description || '',
                image: genre.image,
                color: genre.color || '#000000',
                songs_count: genre.total_songs,
                artists_count: genre.artist_genres.length,
                created_at: genre.created_at.toISOString(),
                is_active: genre.is_active,
            };

            return resolve(mappedGenre);
        }
    )
);