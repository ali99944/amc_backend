// artist_service.js
import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";

export const getAllArtists = async () => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const artists = await prisma.artists.findMany({
                include: {
                    genres: true, // To compute genres_count
                    songs: true,  // To compute songs_count
                },
            });

            // Map to interface
            const mappedArtists = artists.map(artist => ({
                id: artist.id,
                name: artist.name,
                image: artist.image,
                bio: artist.bio || '',
                is_featured: artist.is_featured,
                is_active: artist.is_active,
                songs_count: artist.songs.length,
                genres_count: artist.genres.length,
                total_followers: artist.total_followers,
                created_at: artist.created_at.toISOString(),
            }));

            return resolve(mappedArtists);
        }
    )
);

export const createArtist = async ({ name, bio, image, is_featured, genre_ids }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const artist = await prisma.artists.create({
                data: {
                    name,
                    bio,
                    image,
                    is_featured,
                    is_active: true,
                    genres: genre_ids.length > 0 ? {
                        create: genre_ids.map(id => ({
                            genre_id: id,
                        })),
                    } : undefined,
                },
                include: {
                    genres: true,
                    songs: true,
                },
            });

            // Map to interface
            const mappedArtist = {
                id: artist.id,
                name: artist.name,
                image: artist.image,
                bio: artist.bio || '',
                is_featured: artist.is_featured,
                is_active: artist.is_active,
                songs_count: artist.songs.length,
                genres_count: artist.genres.length,
                total_followers: artist.total_followers,
                created_at: artist.created_at.toISOString(),
            };

            return resolve(mappedArtist);
        }
    )
);

export const deleteArtist = async (id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const artist = await prisma.artists.delete({
                where: {
                    id: +id,
                },
                include: {
                    genres: true,
                    songs: true,
                },
            });

            // Map to interface
            const mappedArtist = {
                id: artist.id,
                name: artist.name,
                image: artist.image,
                bio: artist.bio || '',
                is_featured: artist.is_featured,
                is_active: artist.is_active,
                songs_count: artist.songs.length,
                genres_count: artist.genres.length,
                total_followers: artist.total_followers,
                created_at: artist.created_at.toISOString(),
            };

            return resolve(mappedArtist);
        }
    )
);

export const updateArtist = async ({ id, payload }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const { name, bio, image, is_featured, is_active, genre_ids } = payload;

            // Handle genre updates if provided
            let genreUpdate = {};
            if (genre_ids) {
                // Delete existing genre associations
                await prisma.artist_genre.deleteMany({
                    where: { artist_id: +id },
                });
                // Create new genre associations
                if (genre_ids.length > 0) {
                    genreUpdate = {
                        create: genre_ids.map(id => ({
                            genre_id: id,
                        })),
                    };
                }
            }

            const artist = await prisma.artists.update({
                where: {
                    id: +id,
                },
                data: {
                    name,
                    bio,
                    image,
                    is_featured,
                    is_active,
                    genres: genre_ids ? genreUpdate : undefined,
                },
                include: {
                    genres: true,
                    songs: true,
                },
            });

            // Map to interface
            const mappedArtist = {
                id: artist.id,
                name: artist.name,
                image: artist.image,
                bio: artist.bio || '',
                is_featured: artist.is_featured,
                is_active: artist.is_active,
                songs_count: artist.songs.length,
                genres_count: artist.genres.length,
                total_followers: artist.total_followers,
                created_at: artist.created_at.toISOString(),
            };

            return resolve(mappedArtist);
        }
    )
);