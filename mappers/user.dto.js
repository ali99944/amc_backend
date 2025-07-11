export class UserDTO {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.birth_date = user.birth_date?.toISOString();
    this.gender = user.gender;
    this.profile_picture = user.profile_picture;
    this.phone_number = user.phone_number;
    this.is_banned = user.is_banned;
    this.is_active = user.is_active;
    this.joined_at = user.joined_at?.toISOString();
    this.settings = user.settings ? {
      music_settings: {
        data_saver: user.settings.data_saver,
        crossfade: user.settings.crossfade,
        gapless: user.settings.gapless,
        allow_explicit_content: user.settings.allow_explicit_content,
        show_unplayable_songs: user.settings.show_unplayable_songs,
        normalized_volume: user.settings.normalized_volume,
      },
      notification_settings: {
        email_notifications: user.settings.email_notifications,
        push_notifications: user.settings.push_notifications,
        new_releases: user.settings.new_releases,
        playlist_updates: user.settings.playlist_updates,
        artist_activity: user.settings.artist_activity,
      },
      main_settings: {
        language: user.settings.language,
        theme: user.settings.theme,
        time_zone: user.settings.time_zone,
        profile_visibility: user.settings.profile_visibility,
      },
    } : undefined;
  }
}
