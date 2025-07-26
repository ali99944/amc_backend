// src/controllers/searchController.js (or .ts if you are using TypeScript)

import { PrismaClient } from '@prisma/client';
import asyncWrapper from '../lib/wrappers/async_wrapper.js';

const prisma = new PrismaClient();

// The main function that will handle the advanced search logic
export const unifiedSearchController = asyncWrapper(
    async (req, res) => {
        const query = req.query.q;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({
                error: 'Search query "q" is required and must be a string.'
            });
        }

        // --- ADVANCED SEARCH LOGIC ---
        // We will now use Prisma's OR operator to search across multiple fields
        // for each model, including fields in related models.

        const [songResults, artistResults, playlistResults, podcastResults] = await Promise.all([
            // 1. Search Songs: by title, artist name, and genre name
            prisma.songs.findMany({
                where: {
                    OR: [
                        { // Search by song title
                            title: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                        { // Search by the related artist's name
                            artist: {
                                name: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                        },
                        { // Search by the related genre's name
                            genre: {
                                name: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    ],
                },
                take: 5,
                include: {
                    artist: true, // Always include artist details with the song
                    genre: true,  // Include genre details as well
                },
            }),

            // 2. Search Artists: by name and their associated genres
            prisma.artists.findMany({
                where: {
                    OR: [
                        { // Search by artist name
                            name: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                        { // Search by the names of genres associated with the artist
                            genres: {
                                some: {
                                    genre: {
                                        name: {
                                            contains: query,
                                            mode: 'insensitive',
                                        },
                                    },
                                },
                            },
                        },
                    ],
                },
                take: 5,
            }),

            // 3. Search Playlists: by name and description
            prisma.playlists.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                        {
                            description: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
                take: 5,
                include: {
                    songs: {
                        include: {
                            song: {
                                include: {
                                    artist: true, // Include artist details for each song in the playlist
                                    genre: true,  // Include genre details for each song in the playlist
                                    original_audio: true, // Include original audio details
                                },
                            },
                        },
                    },
                    user: true
                }
            }),

            // 4. Search Podcasts: by name, author, and description
            prisma.podcast.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                        {
                            author: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                        {
                            description: {
                                contains: query,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
                take: 5,
            }),
        ]);

        // --- Format and Combine Results ---

        const formattedSongs = songResults.map(song => ({
            type: 'song',
            data: song,
        }));

        const formattedArtists = artistResults.map(artist => ({
            type: 'artist',
            data: artist,
        }));

        const formattedPlaylists = playlistResults.map(playlist => ({
            type: 'playlist',
            data: playlist,
        }));

        const formattedPodcasts = podcastResults.map(podcast => ({
            type: 'podcast',
            data: podcast,
        }));

        // Combine all formatted results into a single array
        const combinedResults = [
            ...formattedSongs,
            ...formattedArtists,
            ...formattedPlaylists,
            ...formattedPodcasts,
        ];
        
        
        // Optional: You could shuffle the results here if desired
        // combinedResults.sort(() => Math.random() - 0.5);

        res.json(combinedResults);
    }
);