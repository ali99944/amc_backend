import prisma from '../../lib/prisma.js';

export async function seedSongs() {
    const songsData = [
        {
            title: 'Ana Alahly',
            image: 'system/song_covers/ahly.png',
            is_active: true,
            is_explicit: false,
            track_number: '1',
            artist_id: 3,
            genre_id: 1,
            lyrics: 'أنا الأهلي، دايمًا في قلبي، حبك مالي عيوني...',
            description: 'نشيد حماسي عن نادي الأهلي وروح الانتماء.',
            release_date: '2024-02-01',
            created_at: new Date('2024-02-01T10:00:00Z'),
            original_audio: {
                create: {
                    file_path: 'system/audios/ahly.mp3',
                    format: 'mp3',
                    file_size: 4000000,
                    duration: 210,
                    bitrate: 128,
                },
            },
        },
        {
            title: 'Brazili w asmr',
            image: 'system/song_covers/brazili.png',
            is_active: true,
            is_explicit: false,
            track_number: '2',
            artist_id: 2,
            genre_id: 2,
            lyrics: 'برازيلي وأسمَر، في الشارع بنلعب كورة ونغني...',
            description: 'أغنية مرحة عن كرة القدم وأجواء البرازيل.',
            release_date: '2024-04-10',
            created_at: new Date('2024-04-10T12:00:00Z'),
            original_audio: {
                create: {
                    file_path: 'system/audios/brazil.mp3',
                    format: 'mp3',
                    file_size: 3800000,
                    duration: 200,
                    bitrate: 128,
                },
            },
        },
        {
            title: 'Dance Monkey',
            image: 'system/song_covers/dance_monkey.png',
            is_active: true,
            is_explicit: true,
            track_number: '1',
            artist_id: 5,
            genre_id: 3,
            lyrics: 'They say, "Dance for me, dance for me, dance for me, oh-oh-oh"...',
            description: 'أغنية بوب عالمية مشهورة بإيقاعها الراقص وكلماتها الجذابة.',
            release_date: '2023-12-15',
            created_at: new Date('2023-12-15T09:00:00Z'),
            original_audio: {
                create: {
                    file_path: 'system/audios/dance_monkey.mp3',
                    format: 'mp3',
                    file_size: 4200000,
                    duration: 230,
                    bitrate: 128,
                },
            },
        },
        {
            title: 'On Fire',
            image: 'system/song_covers/onfire.png',
            is_active: false,
            is_explicit: false,
            track_number: '3',
            artist_id: 4,
            genre_id: 4,
            lyrics: 'I’m on fire, burning with desire, nothing can stop me tonight...',
            description: 'أغنية روك قوية عن الشغف والإصرار.',
            release_date: '2023-07-20',
            created_at: new Date('2023-07-20T14:00:00Z'),
            original_audio: {
                create: {
                    file_path: 'system/audios/onfire.mp3',
                    format: 'mp3',
                    file_size: 3900000,
                    duration: 215,
                    bitrate: 128,
                },
            },
        },
        {
            title: 'Afroto Kebda',
            image: 'system/song_covers/kebda.png',
            is_active: true,
            is_explicit: false,
            track_number: '1',
            artist_id: 2,
            genre_id: 5,
            lyrics: 'كبدة على العربية، والجو في الحتة نار...',
            description: 'أغنية شعبية عن أجواء الشارع وأكل الكبدة.',
            release_date: '2024-06-01',
            created_at: new Date('2024-06-01T11:00:00Z'),
            original_audio: {
                create: {
                    file_path: 'system/audios/kebda.mp3',
                    format: 'mp3',
                    file_size: 4100000,
                    duration: 220,
                    bitrate: 128,
                },
            },
        },
    ];

    const createdSongs = await prisma.$transaction(
        songsData.map((songData) =>
            prisma.songs.create({
                data: songData,
            })
        )
    );

    console.log(`Seeded ${createdSongs.length} songs`);
}
