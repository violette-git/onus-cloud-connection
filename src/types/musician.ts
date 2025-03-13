
export interface MusicianProfile {
  avatar_url: string | null;
  username: string | null;
  full_name: string | null;
}

export interface Musician {
  id: string;
  user_id: string | null;
  name: string;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  profile?: MusicianProfile;
  musician_genres?: {
    genre: {
      name: string;
    };
  }[];
  songs?: Song[];
  videos?: Video[];
}

export interface Song {
  id: string;
  title: string;
  url: string;
}

export type VideoPlatform = 'youtube' | 'tiktok';

export interface Video {
  id: string;
  title: string;
  url: string;
  platform: VideoPlatform;
  created_at: string;
  updated_at: string;
}
