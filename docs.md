CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'moderator', 'user') DEFAULT 'user',
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    profile_image VARCHAR(255)
);

CREATE TABLE songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist VARCHAR(100) NOT NULL,
    album VARCHAR(100),
    category VARCHAR(50),
    duration VARCHAR(10),
    release_date DATE,
    audio_file VARCHAR(255) NOT NULL,
    cover_image VARCHAR(255),
    plays INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE playlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    cover_image VARCHAR(255),
    user_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE playlist_songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    playlist_id INT NOT NULL,
    song_id INT NOT NULL,
    position INT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    UNIQUE KEY (playlist_id, song_id)
);

CREATE TABLE user_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    song_id INT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, song_id)
);

CREATE TABLE user_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    song_id INT,
    activity_type ENUM('play', 'pause', 'skip', 'complete', 'like', 'add_to_playlist', 'login', 'logout'),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    device_info VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE SET NULL
);

CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    setting_key VARCHAR(50) NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (category, setting_key)
);

CREATE TABLE user_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    setting_key VARCHAR(50) NOT NULL,
    setting_value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, setting_key)
);

CREATE TABLE analytics_daily (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    total_plays INT DEFAULT 0,
    active_users INT DEFAULT 0,
    new_users INT DEFAULT 0,
    total_sessions INT DEFAULT 0,
    avg_session_duration FLOAT DEFAULT 0,
    UNIQUE KEY (date)
);

CREATE TABLE analytics_songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    song_id INT NOT NULL,
    date DATE NOT NULL,
    plays INT DEFAULT 0,
    unique_listeners INT DEFAULT 0,
    avg_completion_rate FLOAT DEFAULT 0,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    UNIQUE KEY (song_id, date)
);

## API Endpoints

Here are the key API endpoints you'll need to implement for your backend:

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info


### Users

- `GET /api/users` - List all users (with pagination and filters)
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user


### Songs

- `GET /api/songs` - List all songs (with pagination and filters)
- `GET /api/songs/:id` - Get song details
- `POST /api/songs` - Upload new song
- `PUT /api/songs/:id` - Update song
- `DELETE /api/songs/:id` - Delete song


### Playlists

- `GET /api/playlists` - List all playlists
- `GET /api/playlists/:id` - Get playlist details with songs
- `POST /api/playlists` - Create new playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/songs` - Add song to playlist
- `DELETE /api/playlists/:id/songs/:songId` - Remove song from playlist
- `PUT /api/playlists/:id/songs/reorder` - Reorder songs in playlist


### Settings

- `GET /api/settings` - Get all global settings
- `PUT /api/settings` - Update global settings
- `GET /api/users/:id/settings` - Get user settings
- `PUT /api/users/:id/settings` - Update user settings


### Analytics

- `GET /api/analytics/overview` - Get overview statistics
- `GET /api/analytics/users` - Get user statistics
- `GET /api/analytics/content` - Get content statistics
- `GET /api/analytics/engagement` - Get engagement statistics
- `GET /api/analytics/daily` - Get daily analytics data
- `GET /api/analytics/top-songs` - Get top songs


CREATE TABLE artists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    country VARCHAR(50),
    image VARCHAR(255),
    debut_date DATE,
    contact_info TEXT,
    social_media JSON,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist_id INT NOT NULL,
    release_date DATE,
    cover_image VARCHAR(255),
    description TEXT,
    genre VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

CREATE TABLE songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist_id INT NOT NULL,
    album_id INT,
    category VARCHAR(50),
    duration VARCHAR(10),
    release_date DATE,
    audio_file VARCHAR(255) NOT NULL,
    cover_image VARCHAR(255),
    plays INT DEFAULT 0,
    lyrics TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE SET NULL
);

CREATE TABLE artist_genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artist_id INT NOT NULL,
    genre VARCHAR(50) NOT NULL,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
    UNIQUE KEY (artist_id, genre)
);

CREATE TABLE analytics_artists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artist_id INT NOT NULL,
    date DATE NOT NULL,
    total_plays INT DEFAULT 0,
    unique_listeners INT DEFAULT 0,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
    UNIQUE KEY (artist_id, date)
);


## Additional API Endpoints for Artist Management

### Artists

- `GET /api/artists` - List all artists (with pagination and filters)
- `GET /api/artists/:id` - Get artist details
- `POST /api/artists` - Create new artist
- `PUT /api/artists/:id` - Update artist
- `DELETE /api/artists/:id` - Delete artist
- `GET /api/artists/:id/songs` - Get all songs by an artist
- `GET /api/artists/:id/albums` - Get all albums by an artist
- `GET /api/artists/:id/analytics` - Get analytics for an artist


### Albums

- `GET /api/albums` - List all albums
- `GET /api/albums/:id` - Get album details with songs
- `POST /api/albums` - Create new album
- `PUT /api/albums/:id` - Update album
- `DELETE /api/albums/:id` - Delete album
- `GET /api/albums/:id/songs` - Get all songs in an album






podcasts
podcast category