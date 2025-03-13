export interface BaseRecord {
  id: string;
  created_at: string;
  updated_at: string;
}

export type Profile = {
  id: string;
  email: string;
  avatar_url: string | null;
  banner_url: string | null;
  comment_preferences: CommentPreferences;
  created_at: string;
  full_name: string | null;
  handle: string | null;
  linking_status: string | null;
  location: string | null;
  role: string;
  username: string | null;
  visibility: string | null;
};

export type Genre = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Musician = {
  id: string;
  profile_id: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  profile: Profile | null;
};

export type MusicianGenre = {
  id: string;
  musician_id: string;
  genre_id: string;
  created_at: string;
  updated_at: string;
};

export type ForumTopic = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  topic_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type Follower = {
  id: string;
  follower_id: string;
  followee_id: string;
  followee: Profile;
  created_at: string;
  updated_at: string;
};

export type Collaborator = {
  id: string;
  musician_id: string;
  collaborator_id: string;
  created_at: string;
  updated_at: string;
};

export type Song = {
  id: string;
  musician_id: string;
  title: string;
  lyrics?: string;
  created_at: string;
  updated_at: string;
};

import { VideoPlatform } from './common';

export type Video = {
  id: string;
  musician_id: string;
  title: string;
  url: string;
  platform: VideoPlatform;
  created_at: string;
  updated_at: string;
};

export type Album = {
  id: string;
  musician_id: string;
  title: string;
  release_date: string;
  created_at: string;
  updated_at: string;
};

export type AlbumSong = {
  id: string;
  album_id: string;
  song_id: string;
  track_number: number;
  created_at: string;
  updated_at: string;
};

export type FeaturedContent = {
  id: string;
  musician_id: string;
  content_id: string;
  content_type: 'song' | 'video';
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type LinkingCode = {
  id: string;
  user_id: string;
  code: string;
  created_at: string;
  expires_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  content: string;
  read_at?: string;
  created_at: string;
  actor_id?: string;
};

export type Nudge = {
  id: string;
  user_id: string;
  type: string;
  content: string;
  sent_at: string;
};

export type SongReaction = {
  id: string;
  user_id: string;
  song_id: string;
  reaction_type: string;
  created_at: string;
};

export type SongPlay = {
  id: string;
  user_id: string;
  song_id: string;
  played_at: string;
};

export type AlbumPlay = {
  id: string;
  user_id: string;
  album_id: string;
  played_at: string;
};

export type SongLike = {
  id: string;
  user_id: string;
  song_id: string;
  liked_at: string;
};

export type GenreFollow = {
  id: string;
  user_id: string;
  genre_id: string;
  followed_at: string;
};

// Ensure functions

export function ensureCommentPreferences(commentPreferences: any): CommentPreferences {
  if (typeof commentPreferences !== 'object' || commentPreferences === null) {
    throw new Error('Invalid comment preferences');
  }
  return {
    email_notifications: Boolean(commentPreferences.email_notifications),
    push_notifications: Boolean(commentPreferences.push_notifications),
    disable_comments: Boolean(commentPreferences.disable_comments),
    // Add other expected properties here
  };
}

export function ensureSocialLinks(socialLinks: any): SocialLinks {
  if (typeof socialLinks !== 'object' || socialLinks === null) {
    throw new Error('Invalid social links');
  }
  return {
    instagram: typeof socialLinks.instagram === 'string' ? socialLinks.instagram : '',
    youtube: typeof socialLinks.youtube === 'string' ? socialLinks.youtube : '',
    linkedin: typeof socialLinks.linkedin === 'string' ? socialLinks.linkedin : '',
    // Add other expected social media platforms here
  };
}

export function ensureThemeColors(themeColors: any): ThemeColors {
  if (typeof themeColors !== 'object' || themeColors === null) {
    throw new Error('Invalid theme colors');
  }
  return {
    primary: typeof themeColors.primary === 'string' ? themeColors.primary : '#000000',
    secondary: typeof themeColors.secondary === 'string' ? themeColors.secondary : '#FFFFFF',
    accent: typeof themeColors.accent === 'string' ? themeColors.accent : '#333333', // Add this line
    // Add other expected properties here
  };
}

// Define types for ensure functions

export type CommentPreferences = {
  email_notifications: boolean;
  push_notifications: boolean;
  disable_comments: boolean;
  // Add other expected properties here
};

export type SocialLinks = {
  instagram: string;
  youtube: string;
  linkedin: string;
  // Add other expected social media platforms here
};

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string; // Add this line
  // Add other expected properties here
};
