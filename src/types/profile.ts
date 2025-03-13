export interface Profile {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'musician' | 'observer';
  created_at: string;
  updated_at: string;
  avatar_url: string | null;
  banner_url: string | null;
  handle: string | null;
  bio: string | null;
  first_name: string | null;
  last_name: string | null;
  location: string | null;
  website: string | null;
  full_name: string | null;
  visibility: string | null;
  suno_username: string | null;
  social_links: SocialLinks | null;
  comment_preferences: CommentPreferences | null;
  theme_colors: ThemeColors | null;
}

export interface Musician {
  id: string;
  user_id: string | null;
  name: string;
  genre_id: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  profile: MusicianProfile | null;
  musician_genres: { id: string; genre: { name: string } }[];
  songs: Song[];
  videos: Video[];
}

export interface MusicianProfile {
  avatar_url: string | null;
  username: string | null;
  full_name: string | null;
}

export interface SocialLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  // Add other social links as needed
}

export interface CommentPreferences {
  disable_comments: boolean;
  // Add other comment preferences as needed
}

export interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  // Add other theme colors as needed
}

import { VideoPlatform } from './common';

export interface Song {
  id: string;
  title: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  platform: VideoPlatform;
  created_at: string;
  updated_at: string;
}
