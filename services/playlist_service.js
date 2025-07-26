// src/services/playlist_service.js

import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";
import { ApiError } from "../lib/api_error.js";
import { NOT_FOUND_STATUS, BAD_REQUEST_STATUS, FORBIDDEN_STATUS } from "../lib/status_codes.js";
import { PlaylistDTO } from "../mappers/playlist.dto.js";
import { SongDTO } from "../mappers/song.dto.js";

// --- Read Operations ---

/**
 * Get all playlists created by a specific user.
 * @param {number} userId - The ID of the user.
 */
export const getUserPlaylists = (userId) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const playlists = await prisma.playlists.findMany({
            where: { user_id: +userId, type: 'user' },
            include: {
                songs: {
                    include: {
                        song: {
                            include: {
                                original_audio: true,
                                artist: true
                            }
                        },
                    }
                },
            }
        });
        resolve(
            PlaylistDTO.fromMany(playlists)
        );
    })
);

/**
 * Get system-generated playlists, optionally filtered by source.
 * @param {string} [source] - Optional source to filter by (e.g., 'recommended', 'ai').
 */
export const getSystemPlaylists = (source) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const whereClause = { type: 'system' };
        if (source) {
            whereClause.source = source;
        }
        const playlists = await prisma.playlists.findMany({
            where: whereClause,
            include: { songs: { include: { song: true } } }
        });
        resolve(playlists);
    })
);

/**
 * Get a single playlist by its ID, including all its songs.
 * @param {number} playlistId - The ID of the playlist.
 */
export const getPlaylistDetails = (playlistId) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const playlist = await prisma.playlists.findUnique({
            where: { id: +playlistId },
            include: {
                songs: {
                    // orderBy: { addedAt: 'asc' },
                    include: { song: { include: { 
                        artist: true,
                        original_audio: true
                     } } }
                },
                user: { select: { name: true } }
            }
        });
        if (!playlist) {
            throw new ApiError("Playlist not found", null, NOT_FOUND_STATUS);
        }
        resolve(
            PlaylistDTO.from(playlist)
        );
    })
);


// --- Write/Update Operations ---

/**
 * Create a new playlist for a user.
 * @param {object} payload
 * @param {string} payload.name
 * @param {string} payload.description
 * @param {number} payload.userId
 * @param {number[]} payload.songs_list - Array of song IDs to add to playlist
 */
export const createUserPlaylist = ({ name, description, userId, songs_list = [] }) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const playlist = await prisma.playlists.create({
            data: {
                name,
                description,
                user_id: +userId,
                type: 'user',
                songs: {
                    create: songs_list.map(songId => ({
                        song_id: +songId
                    }))
                }
            },
            include: {
                songs: {
                    include: {
                        song: {
                            include: {
                                original_audio: true,
                                artist: true
                            }
                        }
                    }
                }
            }
        });
        resolve(
            PlaylistDTO.from(playlist)
        );
    })
);

/**
 * Add a song to a playlist.
 * @param {number} playlistId
 * @param {number} songId
 */
export const addSongToPlaylist = (playlistId, songId) => new Promise(
    promiseAsyncWrapper(async (resolve, reject) => {
        const existing = await prisma.playlist_songs.findUnique({
            where: {
                playlist_id_song_id: {
                    playlist_id: +playlistId,
                    song_id: +songId,
                }
            }
        });

        if (existing) {
            // Depending on desired behavior, you can either throw an error or just do nothing.
            // Throwing an error is often better for clear feedback.
            throw new ApiError("Song is already in this playlist", null, BAD_REQUEST_STATUS);
        }

        const result = await prisma.playlist_songs.create({
            data: {
                playlist_id: +playlistId,
                song_id: +songId,
            }
        });
        resolve(result);
    })
);

/**
 * Remove a song from a playlist.
 * @param {number} playlistId
 * @param {number} songId
 */
export const removeSongFromPlaylist = (playlistId, songId) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        await prisma.playlist_songs.delete({
            where: {
                playlist_id_song_id: {
                    playlist_id: +playlistId,
                    song_id: +songId,
                }
            },
        });
        resolve({ message: "Song removed from playlist successfully." });
    })
);


/**
 * Update a playlist's metadata (name, description, image).
 * @param {number} playlistId
 * @param {number} userId - The ID of the user attempting the update.
 * @param {object} payload - The data to update.
 */
export const updatePlaylistMetadata = (playlistId, payload) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const playlist = await prisma.playlists.findUnique({ where: { id: +playlistId } });
        if (!playlist) {
            throw new ApiError("Playlist not found", null, NOT_FOUND_STATUS);
        }
 

        const updatedPlaylist = await prisma.playlists.update({
            where: { id: +playlistId },
            data: {
                name: payload.name,
                description: payload.description,
                image: payload.image,
            },

            include: {
                songs: {
                    include: {
                        song: {
                            include: {
                                artist: true
                            }
                        }
                    }
                }
            }
        });
        resolve(
            PlaylistDTO.from(updatedPlaylist)
        );
    })
);

/**
 * Delete a user-created playlist.
 * @param {number} playlistId
 * @param {number} userId - The ID of the user attempting the deletion.
 */
export const deleteUserPlaylist = (playlistId, userId) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const playlist = await prisma.playlists.findUnique({ where: { id: +playlistId } });
        if (!playlist) {
            throw new ApiError("Playlist not found", null, NOT_FOUND_STATUS);
        }
        if (playlist.user_id !== +userId) {
            throw new ApiError("You are not authorized to delete this playlist", null, FORBIDDEN_STATUS);
        }

        // Use a transaction to delete the playlist and its song associations
        await prisma.$transaction([
            prisma.playlist_songs.deleteMany({ where: { playlist_id: +playlistId } }),
            prisma.playlists.delete({ where: { id: +playlistId } }),
        ]);

        resolve({ message: "Playlist deleted successfully." });
    })
);


// --- Recommendation/AI Services ---

/**
 * Regenerate an AI/recommended playlist.
 * This is a placeholder for your complex AI logic.
 */
export const regeneratePlaylist = (playlistId) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        // 1. Find the playlist to ensure it's a system/AI playlist
        const playlist = await prisma.playlists.findUnique({ where: { id: +playlistId } });
        if (!playlist || playlist.type !== 'system' || playlist.source !== 'ai') {
            throw new ApiError("This playlist cannot be regenerated.", null, BAD_REQUEST_STATUS);
        }
        
        // 2. TODO: Hook into your AI/Recommendation engine here.
        // This engine would return a new list of song IDs.
        // For now, we'll just mock this.
        console.log(`Regenerating playlist ${playlistId}... (mock implementation)`);
        const newSongIds = [1, 5, 10]; // Example new song IDs from AI
        
        // 3. Update the playlist in a transaction
        await prisma.$transaction([
            // Delete old songs
            prisma.playlist_song.deleteMany({ where: { playlistId: +playlistId } }),
            // Add new songs
            prisma.playlist_song.createMany({
                data: newSongIds.map(songId => ({
                    playlistId: +playlistId,
                    songId: songId,
                }))
            })
        ]);
        
        resolve({ message: "Playlist regenerated successfully." });
    })
);

/**
 * Get personalized "For You" playlists (e.g., Daily Mix, Discover Weekly).
 */
export const getForYouPlaylists = (userId) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const playlists = await prisma.playlists.findMany({
            where: {
                // This logic depends on how you create these playlists.
                // A common pattern is to have them associated with a user but marked as system.
                userId: +userId,
                type: 'system',
                source: { in: ['recommended', 'ai'] }
            },
            take: 10,
        });
        resolve(playlists);
    })
);

export const getLikedSongsPlaylist = (user_id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const liked_songs = await prisma.user_song_likes.findMany({
                where: {
                    user_id
                },

                include: {
                    song: {
                        include: {
                            original_audio: true,
                            artist: true
                        }
                    }
                },

                omit: {
                    song_id: true
                }
            })
            

            const songs_list = liked_songs.map(ob => ob.song)

            const playlist = PlaylistDTO.constructVirtualPlaylist({
                songs_list: songs_list,
                playlist_name: 'Liked Songs'.toUpperCase(),
                playlist_description: 'A collection of your liked songs'
            })
            resolve(playlist);
        }
    )
);


/**
 * Get recently played songs playlist for a user
 * @param {number} user_id - The ID of the user
 */
export const getRecentPlayedSongsPlaylist = (user_id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const recent_songs = await prisma.user_listen_history.findMany({
                where: {
                    user_id
                },
                orderBy: {
                    played_at: 'desc'
                },
                take: 50,
                include: {
                    song: {
                        include: {
                            original_audio: true,
                            artist: true
                        }
                    }
                }
            });

            const songs_list = recent_songs.map(history => history.song);
            const playlist = PlaylistDTO.constructVirtualPlaylist({
                songs_list: songs_list,
                playlist_name: 'Recently Played'.toUpperCase(),
                playlist_description: 'Your recently played songs from the last listening sessions'
            });
            resolve(playlist);
        }
    )
);

/**
 * Get daily mix playlist for a user based on their listening history
 * @param {number} user_id - The ID of the user
 */
export const getDailyMixPlaylist = (user_id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            // Get user's most played genres from history
            const userGenres = await prisma.play_history.groupBy({
                by: ['genre'],
                where: {
                    user_id,
                    played_at: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                    }
                },
                _count: true,
                orderBy: {
                    _count: 'desc'
                },
                take: 3
            });

            // Get songs from user's top genres
            const genreList = userGenres.map(g => g.genre);
            const recommendedSongs = await prisma.songs.findMany({
                where: {
                    genre: {
                        in: genreList
                    }
                },
                include: {
                    original_audio: true,
                    artist: true
                },
                take: 30,
                orderBy: {
                    plays: 'desc'
                }
            });

            const playlist = PlaylistDTO.constructDailyMixPlaylist(recommendedSongs);
            resolve(playlist);
        }
    )
);


/**
 * Copy songs from one playlist to another
 * @param {number} sourcePlaylistId - ID of the source playlist to copy from
 * @param {number} targetPlaylistId - ID of the target playlist to copy to
 * @param {number} userId - ID of the user performing the copy
 */
export const copyPlaylist = (sourcePlaylistId, targetPlaylistId, userId) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        // Verify source playlist exists
        const sourcePlaylist = await prisma.playlists.findUnique({
            where: { id: +sourcePlaylistId },
            include: { songs: true }
        });
        if (!sourcePlaylist) {
            throw new ApiError("Source playlist not found", null, NOT_FOUND_STATUS);
        }

        // Verify target playlist exists and user has permission
        const targetPlaylist = await prisma.playlists.findUnique({
            where: { id: +targetPlaylistId }
        });
        if (!targetPlaylist) {
            throw new ApiError("Target playlist not found", null, NOT_FOUND_STATUS);
        }
        if (targetPlaylist.user_id !== +userId) {
            throw new ApiError("You don't have permission to modify the target playlist", null, FORBIDDEN_STATUS);
        }

        // Get all songs from source playlist
        const sourceSongs = await prisma.playlist_song.findMany({
            where: { playlistId: +sourcePlaylistId }
        });

        // Filter out songs that already exist in target playlist
        const existingSongs = await prisma.playlist_song.findMany({
            where: { playlistId: +targetPlaylistId }
        });
        const existingSongIds = new Set(existingSongs.map(s => s.songId));
        
        const songsToAdd = sourceSongs.filter(song => !existingSongIds.has(song.songId));

        // Add songs to target playlist
        if (songsToAdd.length > 0) {
            await prisma.playlist_song.createMany({
                data: songsToAdd.map(song => ({
                    playlistId: +targetPlaylistId,
                    songId: song.songId
                }))
            });
        }

        resolve({
            message: "Playlist copied successfully",
            copiedSongs: songsToAdd.length
        });
    })
);



/**
 * Get trending playlists based on play count and recent activity
 * @param {number} limit - Number of playlists to return
 */
export const getTrendingPlaylists = (limit = 10) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const playlists = await prisma.playlists.findMany({
            where: {
                type: 'user',
                is_public: true
            },
            include: {
                _count: {
                    select: { songs: true }
                },
                songs: {
                    include: {
                        song: {
                            include: {
                                original_audio: true,
                                artist: true
                            }
                        }
                    }
                }
            },
            orderBy: [
                { play_count: 'desc' },
                { updated_at: 'desc' }
            ],
            take: limit
        });
        resolve(playlists.map(playlist => PlaylistDTO.from(playlist)));
    })
);

/**
 * Get featured playlists curated by admins
 */
export const getFeaturedPlaylists = () => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const playlists = await prisma.playlists.findMany({
            where: {
                is_featured: true
            },
            include: {
                songs: {
                    include: {
                        song: {
                            include: {
                                original_audio: true,
                                artist: true
                            }
                        }
                    }
                }
            }
        });
        resolve(playlists.map(playlist => PlaylistDTO.from(playlist)));
    })
);

/**
 * Toggle playlist visibility between public and private
 * @param {number} playlistId - ID of the playlist
 * @param {number} userId - ID of the user making the change
 */
export const togglePlaylistVisibility = (playlistId, userId) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const playlist = await prisma.playlists.findUnique({
            where: { id: +playlistId }
        });

        if (!playlist) {
            throw new ApiError("Playlist not found", null, NOT_FOUND_STATUS);
        }

        if (playlist.user_id !== +userId) {
            throw new ApiError("You don't have permission to modify this playlist", null, FORBIDDEN_STATUS);
        }

        const updatedPlaylist = await prisma.playlists.update({
            where: { id: +playlistId },
            data: { is_public: !playlist.is_public }
        });

        resolve(PlaylistDTO.from(updatedPlaylist));
    })
);

/**
 * Increment playlist play count
 * @param {number} playlistId - ID of the playlist
 */
export const incrementPlaylistPlayCount = (playlistId) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const updatedPlaylist = await prisma.playlists.update({
            where: { id: +playlistId },
            data: {
                play_count: {
                    increment: 1
                },
                last_played: new Date()
            }
        });
        resolve(updatedPlaylist);
    })
);

/**
 * Get similar playlists based on genre and tags
 * @param {number} playlistId - ID of the playlist
 * @param {number} limit - Number of similar playlists to return
 */
export const getSimilarPlaylists = (playlistId, limit = 5) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const sourcePlaylist = await prisma.playlists.findUnique({
            where: { id: +playlistId },
            include: {
                songs: {
                    include: {
                        song: true
                    }
                }
            }
        });

        if (!sourcePlaylist) {
            throw new ApiError("Playlist not found", null, NOT_FOUND_STATUS);
        }

        // Get genres from source playlist songs
        const genres = [...new Set(sourcePlaylist.songs.map(ps => ps.song.genre))];

        const similarPlaylists = await prisma.playlists.findMany({
            where: {
                id: { not: +playlistId },
                is_public: true,
                songs: {
                    some: {
                        song: {
                            genre: {
                                in: genres
                            }
                        }
                    }
                }
            },
            include: {
                songs: {
                    include: {
                        song: {
                            include: {
                                original_audio: true,
                                artist: true
                            }
                        }
                    }
                }
            },
            take: limit
        });

        resolve(similarPlaylists.map(playlist => PlaylistDTO.from(playlist)));
    })
);

/**
 * Reorder songs in a playlist
 * @param {number} playlistId - ID of the playlist
 * @param {number} userId - ID of the user making the change
 * @param {Array<number>} songOrder - Array of song IDs in new order
 */
export const reorderPlaylistSongs = (playlistId, userId, songOrder) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const playlist = await prisma.playlists.findUnique({
            where: { id: +playlistId }
        });

        if (!playlist) {
            throw new ApiError("Playlist not found", null, NOT_FOUND_STATUS);
        }

        if (playlist.user_id !== +userId) {
            throw new ApiError("You don't have permission to modify this playlist", null, FORBIDDEN_STATUS);
        }

        // Update song positions in transaction
        await prisma.$transaction(
            songOrder.map((songId, index) => 
                prisma.playlist_song.update({
                    where: {
                        playlistId_songId: {
                            playlistId: +playlistId,
                            songId: +songId
                        }
                    },
                    data: { position: index }
                })
            )
        );

        resolve({ message: "Playlist order updated successfully" });
    })
);


/**
 * Get songs from a specific playlist
 * @param {number} playlistId - The ID of the playlist
 */
export const getPlaylistSongs = (playlistId) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const songs = await prisma.playlist_songs.findMany({
            where: { playlist_id: +playlistId },
            include: {
                song: {
                    include: {
                        original_audio: true,
                        artist: true
                    }
                }
            },
            // orderBy: {
            //     addedAt: 'asc'
            // }
        });

        if (!songs.length) {
            throw new ApiError("No songs found in this playlist", null, NOT_FOUND_STATUS);
        }

        resolve(
            SongDTO.fromMany(
                songs.map(ps => ps.song)
            )
        );
    })
);
