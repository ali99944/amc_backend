import { PrismaClient } from '@prisma/client';
import asyncWrapper from '../lib/wrappers/async_wrapper.js'; // Assuming you have this

const prisma = new PrismaClient();

// Helper to format data for the frontend ContentItem model
const formatAsContentItem = (item, type) => {
    if (type === 'artist') {
        return {
            id: item.id.toString(),
            title: item.name,
            subtitle: 'Artist',
            imageUrl: item.image,
            isCircular: true,
        };
    }
    // For albums and playlists
    return {
        id: item.id.toString(),
        title: item.name,
        subtitle: type === 'album' ? `Album by ${item.artist?.name}` : 'Playlist',
        imageUrl: item.image,
        isCircular: false,
    };
};


// 1. Controller for "Quick Picks"
export const getQuickPicks = asyncWrapper(async (req, res) => {
    // Fetch the system-defined "Liked Songs" playlist
    const likedSongsPlaylist = {
        id: 'liked-songs',
        title: 'Liked Songs',
        subtitle: 'Playlist',
        imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    };

    // Fetch user-created playlists, ordered by some logic (e.g., last updated)
    const userPlaylists = await prisma.playlists.findMany({
        take: 5,
    });
    
    // Combine and slice to get 6 items
    const quickPicks = [
        likedSongsPlaylist,
        ...userPlaylists.map(p => formatAsContentItem(p, 'playlist'))
    ].slice(0, 6);

    res.json(quickPicks);
});

// 2. Controller for "Made for You"
export const getMadeForYou = asyncWrapper(async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    // This fetches playlists specifically marked as system-generated for the user
    const playlists = await prisma.playlist.findMany({
        where: { userId, isSystemGenerated: true },
        take: 10,
    });
    res.json(playlists.map(p => formatAsContentItem(p, 'playlist')));
});

// 3. Controller for "Jump Back In"
export const getJumpBackIn = asyncWrapper(async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const history = await prisma.listeningHistory.findMany({
        where: { userId },
        orderBy: { playedAt: 'desc' },
        take: 20, // Fetch more to ensure we get unique albums
        include: { song: { include: { album: { include: { artist: true } } } } }
    });

    // Process to get unique, recent albums
    const uniqueAlbums = history
        .map(h => h.song.album)
        .filter(album => album != null)
        .reduce((unique, item) => unique.some(u => u.id === item.id) ? unique : [...unique, item], [])
        .slice(0, 10);

    res.json(uniqueAlbums.map(a => formatAsContentItem(a, 'album')));
});

// 4. Controller for "Featured Artists"
export const getFeaturedArtists = asyncWrapper(async (req, res) => {
    const artists = await prisma.artist.findMany({
        where: { isFeatured: true },
        take: 10
    });
    res.json(artists.map(a => formatAsContentItem(a, 'artist')));
});

// 5. Controller for "New Releases"
export const getNewReleases = asyncWrapper(async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    // Find artists the user follows
    const followed = await prisma.followedArtist.findMany({
        where: { userId },
        select: { artistId: true }
    });
    const followedArtistIds = followed.map(f => f.artistId);

    // Find new albums from those artists
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newAlbums = await prisma.album.findMany({
        where: {
            artistId: { in: followedArtistIds },
            releaseDate: { gte: thirtyDaysAgo }
        },
        orderBy: { releaseDate: 'desc' },
        take: 10,
        include: { artist: true }
    });

    res.json(newAlbums.map(a => formatAsContentItem(a, 'album')));
});