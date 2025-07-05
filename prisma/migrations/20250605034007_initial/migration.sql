-- CreateEnum
CREATE TYPE "manager_role" AS ENUM ('admin', 'super_admin');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'inactive', 'banned');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('basic', 'premium');

-- CreateEnum
CREATE TYPE "gender" AS ENUM ('male', 'female', 'other');

-- CreateTable
CREATE TABLE "albums" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "cover_image" TEXT NOT NULL,
    "release_date" TIMESTAMP(3) NOT NULL,
    "total_songs" INTEGER NOT NULL DEFAULT 0,
    "total_plays" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "artist_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "total_followers" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist_followers" (
    "id" SERIAL NOT NULL,
    "artist_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "followed_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artist_followers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist_genre" (
    "id" SERIAL NOT NULL,
    "genre_id" INTEGER NOT NULL,
    "artist_id" INTEGER NOT NULL,

    CONSTRAINT "artist_genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audios" (
    "id" SERIAL NOT NULL,
    "audio_src" TEXT NOT NULL,
    "metadata_id" INTEGER,
    "song_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "audios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audio_metadata" (
    "id" SERIAL NOT NULL,
    "bitrate" INTEGER NOT NULL,
    "sample_rate" INTEGER NOT NULL,
    "file_size" DOUBLE PRECISION NOT NULL,
    "extension" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "audio_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "total_songs" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "managers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "last_login" TIMESTAMP(3),
    "role" "manager_role" NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manager_permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "manager_id" INTEGER NOT NULL,

    CONSTRAINT "manager_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "transaction_id" TEXT,
    "user_id" INTEGER NOT NULL,
    "subscription_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlists" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cover_image" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "total_songs" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist_songs" (
    "id" SERIAL NOT NULL,
    "song_id" INTEGER NOT NULL,
    "playlist_id" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "podcast_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "podcast_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "podcast_seasons" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cover_image" TEXT NOT NULL,
    "release_date" TIMESTAMP(3) NOT NULL,
    "category_id" INTEGER NOT NULL,
    "host_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "podcast_seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "podcast_episodes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "audio_src" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "cover_image" TEXT,
    "release_date" TIMESTAMP(3) NOT NULL,
    "season_id" INTEGER NOT NULL,
    "transcript" TEXT,
    "play_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "podcast_episodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "podcast_host" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "podcast_host_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "controls" JSONB NOT NULL,
    "updated_at" TEXT,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "songs" (
    "id" SERIAL NOT NULL,
    "genre_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "audio_src" TEXT NOT NULL,
    "total_likes" INTEGER NOT NULL DEFAULT 0,
    "total_plays" INTEGER NOT NULL DEFAULT 0,
    "cover_image" TEXT NOT NULL,
    "artist_id" INTEGER NOT NULL,
    "lyrics" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "release_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "song_likes" (
    "id" SERIAL NOT NULL,
    "song_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "song_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "features" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "auto_renew" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_playlists" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "playlist_id" INTEGER NOT NULL,
    "playlist_name" TEXT NOT NULL,
    "playlist_cover_url" TEXT NOT NULL,
    "playlist_description" TEXT NOT NULL,
    "playlist_songs_count" INTEGER NOT NULL,

    CONSTRAINT "user_playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "activated_at" TIMESTAMP(3),
    "last_login_time" TIMESTAMP(3),
    "birth_date" TIMESTAMP(3) NOT NULL,
    "role" "user_role" NOT NULL DEFAULT 'basic',
    "status" "user_status" NOT NULL DEFAULT 'inactive',
    "gender" "gender" NOT NULL,
    "profile_picture" TEXT,
    "phone_number" TEXT,
    "deleted_at" TIMESTAMP(3),
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "two_factor_secret" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "data_saver" BOOLEAN NOT NULL DEFAULT true,
    "crossfade" BOOLEAN NOT NULL DEFAULT false,
    "gapless_playback" BOOLEAN NOT NULL DEFAULT true,
    "allow_explicit_content" BOOLEAN NOT NULL DEFAULT false,
    "show_unplayable_songs" BOOLEAN NOT NULL DEFAULT true,
    "normalize_volume" BOOLEAN NOT NULL DEFAULT false,
    "device_broadcast_status" BOOLEAN NOT NULL DEFAULT true,
    "audio_quality" TEXT NOT NULL DEFAULT 'normal',
    "download_quality" TEXT NOT NULL DEFAULT 'normal',
    "autoplay_similar_songs" BOOLEAN NOT NULL DEFAULT true,
    "push_notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    "email_notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    "your_music_notifications_push" BOOLEAN NOT NULL DEFAULT true,
    "your_music_notifications_email" BOOLEAN NOT NULL DEFAULT true,
    "new_music_notifications_push" BOOLEAN NOT NULL DEFAULT true,
    "new_music_notifications_email" BOOLEAN NOT NULL DEFAULT true,
    "playlist_update_notifications_push" BOOLEAN NOT NULL DEFAULT true,
    "playlist_update_notifications_email" BOOLEAN NOT NULL DEFAULT true,
    "concert_notifications_push" BOOLEAN NOT NULL DEFAULT true,
    "concert_notifications_email" BOOLEAN NOT NULL DEFAULT true,
    "artist_update_notifications_push" BOOLEAN NOT NULL DEFAULT true,
    "artist_update_notifications_email" BOOLEAN NOT NULL DEFAULT true,
    "social_notifications_push" BOOLEAN NOT NULL DEFAULT true,
    "social_notifications_email" BOOLEAN NOT NULL DEFAULT true,
    "selected_language" TEXT NOT NULL DEFAULT 'en',
    "preferred_languages" TEXT[],
    "theme" TEXT NOT NULL DEFAULT 'system',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_codes" (
    "id" SERIAL NOT NULL,
    "activation_code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_genre_interests" (
    "id" SERIAL NOT NULL,
    "genre_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_genre_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_artist_interests" (
    "id" SERIAL NOT NULL,
    "artist_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_artist_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorites" (
    "id" SERIAL NOT NULL,
    "song_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_albumsTosongs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_albumsTosongs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "albums_artist_id_idx" ON "albums"("artist_id");

-- CreateIndex
CREATE INDEX "albums_genre_id_idx" ON "albums"("genre_id");

-- CreateIndex
CREATE UNIQUE INDEX "audios_metadata_id_key" ON "audios"("metadata_id");

-- CreateIndex
CREATE UNIQUE INDEX "audios_song_id_key" ON "audios"("song_id");

-- CreateIndex
CREATE UNIQUE INDEX "managers_username_key" ON "managers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "manager_permissions_value_key" ON "manager_permissions"("value");

-- CreateIndex
CREATE INDEX "payments_user_id_idx" ON "payments"("user_id");

-- CreateIndex
CREATE INDEX "payments_subscription_id_idx" ON "payments"("subscription_id");

-- CreateIndex
CREATE INDEX "playlists_user_id_idx" ON "playlists"("user_id");

-- CreateIndex
CREATE INDEX "playlist_songs_playlist_id_idx" ON "playlist_songs"("playlist_id");

-- CreateIndex
CREATE INDEX "playlist_songs_song_id_idx" ON "playlist_songs"("song_id");

-- CreateIndex
CREATE INDEX "podcast_seasons_category_id_idx" ON "podcast_seasons"("category_id");

-- CreateIndex
CREATE INDEX "podcast_seasons_host_id_idx" ON "podcast_seasons"("host_id");

-- CreateIndex
CREATE INDEX "podcast_episodes_season_id_idx" ON "podcast_episodes"("season_id");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "subscriptions_plan_id_idx" ON "subscriptions"("plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE INDEX "_albumsTosongs_B_index" ON "_albumsTosongs"("B");

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_followers" ADD CONSTRAINT "artist_followers_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_followers" ADD CONSTRAINT "artist_followers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_genre" ADD CONSTRAINT "artist_genre_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_genre" ADD CONSTRAINT "artist_genre_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audios" ADD CONSTRAINT "audios_metadata_id_fkey" FOREIGN KEY ("metadata_id") REFERENCES "audio_metadata"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audios" ADD CONSTRAINT "audios_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "songs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manager_permissions" ADD CONSTRAINT "manager_permissions_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "managers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_songs" ADD CONSTRAINT "playlist_songs_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_songs" ADD CONSTRAINT "playlist_songs_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "podcast_seasons" ADD CONSTRAINT "podcast_seasons_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "podcast_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "podcast_seasons" ADD CONSTRAINT "podcast_seasons_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "podcast_host"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "podcast_episodes" ADD CONSTRAINT "podcast_episodes_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "podcast_seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_likes" ADD CONSTRAINT "song_likes_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "song_likes" ADD CONSTRAINT "song_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_playlists" ADD CONSTRAINT "user_playlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_genre_interests" ADD CONSTRAINT "user_genre_interests_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_genre_interests" ADD CONSTRAINT "user_genre_interests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_artist_interests" ADD CONSTRAINT "user_artist_interests_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_artist_interests" ADD CONSTRAINT "user_artist_interests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "songs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_albumsTosongs" ADD CONSTRAINT "_albumsTosongs_A_fkey" FOREIGN KEY ("A") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_albumsTosongs" ADD CONSTRAINT "_albumsTosongs_B_fkey" FOREIGN KEY ("B") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
