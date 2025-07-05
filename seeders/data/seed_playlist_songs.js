/**
 * Seeds playlist-song relations into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {Array} playlists - Array of created playlists
 * @param {Array} songs - Array of created songs
 * @returns {Promise<void>}
 */
export async function seedPlaylistSongs(prisma, playlists, songs) {
    const playlistSongs = await prisma.playlist_song.createMany({
      data: [
        { playlist_id: playlists[0].id, song_id: songs[0].id }, // Pop Hits - Blinding Lights
        { playlist_id: playlists[0].id, song_id: songs[1].id }, // Pop Hits - Save Your Tears
        { playlist_id: playlists[0].id, song_id: songs[2].id }, // Pop Hits - Bad Guy
        { playlist_id: playlists[1].id, song_id: songs[4].id }, // Chill Jazz - Don’t Know Why
        { playlist_id: playlists[1].id, song_id: songs[9].id }, // Chill Jazz - Come Away With Me
        { playlist_id: playlists[2].id, song_id: songs[6].id }, // EDM - Slide
        { playlist_id: playlists[2].id, song_id: songs[7].id }, // EDM - Feels
      ],
      skipDuplicates: true,
    });
    console.log(`Seeded ${playlistSongs.count} playlist-song relations`);
  }