export interface SocialLinks {
  [key: string]: string;
  instagram: string;
  youtube: string;
  linkedin: string;
}

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  social_links: SocialLinks | null;
  created_at: string;
  updated_at: string | null;
}

export interface Song {
  id: string;
  title: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export type VideoPlatform = 'youtube' | 'tiktok';

export interface Video {
  id: string;
  title: string;
  url: string;
  platform: string; // Changed from VideoPlatform to string to match database
  created_at: string;
  updated_at: string;
}

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
  created_at: string;
  updated_at: string;
  profile?: MusicianProfile;
  musician_genres?: {
    genre: {
      name: string;
    };
  }[];
  songs?: Song[];
  videos?: Video[];
}