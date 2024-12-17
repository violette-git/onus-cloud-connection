export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  role: string;
  social_links: SocialLinks;
  comment_preferences: CommentPreferences;
  theme_colors: ThemeColors;
  handle: string | null;
  visibility: 'public' | 'private' | 'followers';
  created_at: string;
  updated_at?: string;
  rich_text_bio?: string | null;
  suno_username?: string | null;  // Added Suno fields
  suno_email?: string | null;     // Added Suno fields
}

export interface SocialLinks {
  instagram: string;
  youtube: string;
  linkedin: string;
}

export interface CommentPreferences {
  disable_comments: boolean;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

export type { Musician, Song, Video, VideoPlatform } from './musician';