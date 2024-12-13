export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Basic table types
export interface BaseRecord {
  created_at: string;
  updated_at?: string;
}

export interface CommentPreferences {
  disable_comments: boolean;
}

// User and Profile related types
export interface Profile extends BaseRecord {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  social_links: SocialLinks;
  comment_preferences: CommentPreferences;
}

export interface SocialLinks {
  [key: string]: string;
  instagram: string;
  youtube: string;
  linkedin: string;
}