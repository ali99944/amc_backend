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

export const getArtistProfile = async (id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const artist = await prisma.artists.findUnique({
                where: { id: +id },
                include: {
                    genres: true,
                    songs: {
                        include: {
                            original_audio: true
                        }
                    },
                },
            });

            if (!artist) {
                throw new ApiError('Artist not found', 404, 'Not Found');
            }

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

            const topTracks = artist.songs.map(s => ({
                id: s.id,
                title: s.title,
                image: s.image,
                duration: s.original_audio.duration,
                track_number: s.track_number,
                is_active: s.is_active,
                is_featured: s.is_featured,
                original_audio: s.original_audio,
                created_at: s.created_at
            }));

            const relatedArtists = await prisma.artists.findMany({
                where: {
                    id: { not: artist.id },
                    genres: {
                        some: {
                            genre_id: { in: artist.genres.map(g => g.genre_id) },
                        },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    image: true,
                    bio: true,
                    is_featured: true
                },
                take: 5,
            });

            const mappedRelatedArtists = relatedArtists.map(a => ({
                id: a.id,
                name: a.name,
                image: a.image,
                bio: a.bio || '',
                is_featured: a.is_featured,
                total_followers: 0
            }));

            return resolve({
                artistDetails: mappedArtist,
                topTracks,
                relatedArtists: mappedRelatedArtists,
            });
        }
    )
);
