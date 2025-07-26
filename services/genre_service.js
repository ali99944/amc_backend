import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";
import { AlbumDTO } from "../mappers/album.dto.js";
import { ArtistDTO } from "../mappers/artist.dto.js";
import { PlaylistDTO } from "../mappers/playlist.dto.js";

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
                // songs_count: genre.total_songs,
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
                }
            });

            // Map to interface
            const mappedGenre = {
                id: genre.id,
                name: genre.name,
                description: genre.description || '',
                image: genre.image,
                color: genre.color || '#000000',
                created_at: genre.created_at.toISOString(),
                is_active: genre.is_active,
            };

            return resolve(mappedGenre);
        }
    )
);


export const getGenreArtists = async (genreId) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            // const artists = await prisma.artist_genre.findMany({
            //     where: {
            //         genre_id: +genreId,
            //     },
            //     include: {
            //         artist: true,
            //     }
            // });

            const artists = await prisma.artists.findMany({
                include: {
                    genres: true
                }
            })
                
            console.log(artists);
            

            return resolve(
                ArtistDTO.fromMany(artists)
            );
        }
    )
);

export const getGenreNewReleases = async (genreId) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const new_releases = await prisma.albums.findMany({
                where: {
                    // genre_id: +genreId,
                    is_active: true
                },
                orderBy: {
                    created_at: 'desc'
                },
                take: 10, // Limit to latest 10 releases
                include: {
                    artist: true,
                    songs: {
                        include: {
                            song: {
                                include:{
                                    artist: true,
                                    original_audio: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            songs: true
                        }
                    }
                }
            });


            console.log(new_releases);
            

            return resolve(
                AlbumDTO.fromMany(new_releases)
            );
        }
    )
);

export const getGenrePlaylists = async (genreId) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const playlists = await prisma.playlists.findMany({
                where: {
                    isActive: true,
                    type: 'system',
                    source: {
                        not: 'ai'
                    }
                    
                },
                include: {
                    songs: {
                        include: {
                            song: {
                                include: {
                                    original_audio: true,
                                    genre: true
                                }
                            }
                        }
                    }
                }
            });

            // const filtered_playlists = playlists.filter(playlist => {
            //     return playlist.genre.id.toLowerCase() == genreId.toString().toLowerCase()
            // })

            return resolve(
                PlaylistDTO.fromMany(playlists)
            );
        }
    )
);
