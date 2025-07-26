// artist_service.js
import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";
import { ArtistDTO } from "../mappers/artist.dto.js";
import { ArtistProfileDTO } from "../mappers/artist_profile.dto.js";

export const getAllArtists = async () => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const artists = await prisma.artists.findMany({
                include: {
                    genres: true
                },
            });



            return resolve(
                ArtistDTO.fromMany(artists)
            );
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
                    genres: true
                },
            });


            return resolve(
                ArtistDTO.from(artist)
            );
        }
    )
);

export const deleteArtist = async (id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            await prisma.artists.delete({
                where: {
                    id: +id,
                }
            });

            return resolve(true);
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
                    genres: true
                },
            });


            return resolve(
                ArtistDTO.from(artist)
            );
        }
    )
);

export const getArtistProfile = async (id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const artist = await prisma.artists.findUnique({
                where: { id: +id },
                include: {
                    genres: true
                },
            });

            

            if (!artist) {
                throw new ApiError('Artist not found', 404, 'Not Found');
            }


            const tracks = await prisma.songs.findMany({
                where: {
                    artist_id: artist.id
                },

                include: {
                    original_audio: true
                }
            })            

            const albums = await prisma.albums.findMany({
                where: {
                    artist_id: artist.id
                },

                include: {
                    artist: true
                }
            })


            const related_artists = await prisma.artists.findMany({
                where: {
                    id: { not: artist.id },
                    genres: {
                        some: {
                            genre_id: { in: artist.genres.map(g => g.genre_id) },
                        },
                    },
                },
                take: 5,
            });

            

            return resolve(
                ArtistProfileDTO.from({
                    albums, 
                    top_tracks: tracks,
                    artist: artist,
                    related_artists: related_artists
                })
            )
        }
    )
);

export const followArtist = async ({ user_id, artist_id }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            // Check if already followed
            const existing = await prisma.artist_followers.findUnique({
                where: {
                    user_id_artist_id: {
                        user_id: +user_id,
                        artist_id: +artist_id
                    }
                }
            });
            if (existing) {
                return resolve({ followed: true, message: "Already following" });
            }
            const follow = await prisma.artist_followers.create({
                data: {
                    user_id: +user_id,
                    artist_id: +artist_id
                }
            });
            // Optionally increment followers_count on artist
            await prisma.artists.update({
                where: { id: +artist_id },
                data: { followers_count: { increment: 1 } }
            });
            return resolve({ followed: true, follow });
        }
    )
);

export const unfollowArtist = async ({ user_id, artist_id }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const deleted = await prisma.artist_followers.deleteMany({
                where: {
                    user_id: +user_id,
                    artist_id: +artist_id
                }
            });
            // Optionally decrement followers_count on artist
            if (deleted.count > 0) {
                await prisma.artists.update({
                    where: { id: +artist_id },
                    data: { followers_count: { decrement: 1 } }
                });
            }
            return resolve({ followed: false, deleted: deleted.count });
        }
    )
);

export const isUserFollowingArtist = async ({ user_id, artist_id }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const follow = await prisma.artist_followers.findUnique({
                where: {
                    user_id_artist_id: {
                        user_id: +user_id,
                        artist_id: +artist_id
                    }
                }
            });
            // return resolve({ isFollowing: !!follow });
            return resolve(!!follow);
        }
    )
);

export const getFollowedArtists = async (user_id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const followedArtists = await prisma.artists.findMany({
                where: {
                    artist_followers: {
                        some: {
                            user_id: +user_id
                        }
                    }
                },
                include: {
                    genres: true
                }
            });

            return resolve(
                ArtistDTO.fromMany(followedArtists)
            );
        }
    )
);
