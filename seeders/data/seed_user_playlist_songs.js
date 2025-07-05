/**
 * Seeds user playlist-song relations into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {Array} userPlaylists - Array of created user playlists
 * @param {Array} songs - Array of created songs
 * @returns {Promise<void>}
 */
export async function seedUserPlaylistSongs(prisma, userPlaylists, songs) {
    const userPlaylistSongs = await prisma.user_playlist_song.createMany({
      data: [
        { user_playlist_id: userPlaylists[0].id, song_id: songs[0].id }, // Emma - Blinding Lights
        { user_playlist_id: userPlaylists[0].id, song_id: songs[2].id }, // Emma - Bad Guy
        { user_playlist_id: userPlaylists[1].id, song_id: songs[3].id }, // Liam - Circles
        { user_playlist_id: userPlaylists[1].id, song_id: songs[5].id }, // Liam - One Right Now
        { user_playlist_id: userPlaylists[2].id, song_id: songs[6].id }, // Sophia - Slide
        { user_playlist_id: userPlaylists[2].id, song_id: songs[7].id }, // Sophia - Feels
      ],
      skipDuplicates: true,
    });
    console.log(`Seeded ${userPlaylistSongs.count} user playlist-song relations`);
  }