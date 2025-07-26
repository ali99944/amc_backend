import argon2 from 'argon2';
import prisma from '../../lib/prisma.js';

export async function seedUsers() {
  const usersData = [
    {
      name: 'Emma Watson',
      email: 'emma.watson@example.com',
      password: await argon2.hash('Password123!'),
      gender: 'female',
      birth_date: new Date('1990-04-15'),
      profile_picture: 'https://img.freepik.com/free-photo/portrait-young-woman-with-natural-make-up_23-2149084947.jpg',
      is_active: true,
      is_banned: false,
      joined_at: new Date('2025-06-01T08:00:00Z'),
      last_login_time: new Date('2025-06-18T09:00:00Z'),
    },
    {
      name: 'Liam Hemsworth',
      email: 'liam.hemsworth@example.com',
      password: await argon2.hash('Password123!'),
      gender: 'male',
      birth_date: new Date('1992-08-23'),
      profile_picture: 'https://img.freepik.com/free-photo/portrait-handsome-young-man-smiling_23-2149084948.jpg',
      is_active: true,
      is_banned: false,
      joined_at: new Date('2025-06-02T09:00:00Z'),
      last_login_time: new Date('2025-06-17T10:00:00Z'),
    },
    {
      name: 'Sophia Rodriguez',
      email: 'sophia.rodriguez@example.com',
      password: await argon2.hash('Password123!'),
      gender: 'female',
      birth_date: new Date('1995-11-30'),
      profile_picture: 'https://img.freepik.com/free-photo/portrait-young-woman-smiling_23-2149084949.jpg',
      is_active: true,
      is_banned: false,
      joined_at: new Date('2025-06-03T10:00:00Z'),
      last_login_time: new Date('2025-06-16T11:00:00Z'),
    },
    {
      name: 'Noah Patel',
      email: 'noah.patel@example.com',
      password: await argon2.hash('Password123!'),
      gender: 'male',
      birth_date: new Date('1993-02-18'),
      profile_picture: 'https://img.freepik.com/free-photo/portrait-young-man-smiling_23-2149084950.jpg',
      is_active: false,
      is_banned: false,
      joined_at: new Date('2025-05-15T11:00:00Z'),
    },
    {
      name: 'Ava Chen',
      email: 'ava.chen@example.com',
      password: await argon2.hash('Password123!'),
      gender: 'other',
      birth_date: new Date('1994-06-07'),
      profile_picture: 'https://img.freepik.com/free-photo/portrait-young-person-smiling_23-2149084951.jpg',
      is_active: true,
      is_banned: true,
      joined_at: new Date('2025-05-20T12:00:00Z'),
      last_login_time: new Date('2025-05-21T13:00:00Z'),
    },
    {
      name: 'Developer',
      email: 'dev@amc.com',
      password: await argon2.hash('dev'),
      gender: 'male',
      birth_date: new Date('2000-09-23'),
      // profile_picture: 'https://img.freepik.com/free-photo/portrait-young-person-smiling_23-2149084951.jpg',
      is_active: true,
      is_banned: true,
      joined_at: new Date('2025-05-20T12:00:00Z'),
      last_login_time: new Date('2025-05-21T13:00:00Z'),
    },
  ];

  // Create users and their settings in a transaction
  const createdUsers = await prisma.$transaction(
    usersData.map((userData) =>
      prisma.users.create({
        data: {
          ...userData,
          settings: {
            create: {
              data_saver: true,
              crossfade: false,
              gapless_playback: true,
              allow_explicit_content: false,
              show_unplayable_songs: true,
              normalize_volume: false,
              shuffle_playback: false,
              repeat_playback: false,
              play_next_song_automatically: true,
            },
          },
        },
      })
    )
  );

  console.log(`Seeded ${createdUsers.length} users with settings`);
}