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
  require_follow_to_comment?: boolean;
  moderation_enabled?: boolean;
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  slug: string;
  category: string;
  is_pinned: boolean;
  is_locked: boolean;
}

export interface Comment {
  id: string;
  created_at: string;
  content: string;
  content_type: 'song' | 'video' | 'forum';
  content_id: string;
  user_id: string;
  parent_id: string | null;
  thread_path: string;
  forum_topic_id?: string;
}

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'created_at'>;
        Update: Partial<Comment>;
      };
      forum_topics: {
        Row: ForumTopic;
        Insert: Omit<ForumTopic, 'id' | 'created_at'>;
        Update: Partial<ForumTopic>;
      };
    };
  };
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

// User and Profile related types
export interface Profile extends BaseRecord {
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
}

export interface SocialLinks {
  instagram: string;
  youtube: string;
  linkedin: string;
}

// Helper function to ensure proper typing of JSON fields
export const ensureCommentPreferences = (data: Json | null): CommentPreferences => {
  if (!data || Array.isArray(data)) {
    return { disable_comments: false };
  }
  return { disable_comments: Boolean((data as any).disable_comments) };
};

export const ensureSocialLinks = (data: Json | null): SocialLinks => {
  if (!data || Array.isArray(data)) {
    return { instagram: '', youtube: '', linkedin: '' };
  }
  const links = data as Record<string, string>;
  return {
    instagram: links.instagram || '',
    youtube: links.youtube || '',
    linkedin: links.linkedin || ''
  };
};

export const ensureThemeColors = (data: Json | null): ThemeColors => {
  if (!data || Array.isArray(data)) {
    return {
      primary: '#6B46C1',
      secondary: '#4299E1',
      accent: '#ED64A6'
    };
  }
  const colors = data as Record<string, string>;
  return {
    primary: colors.primary || '#6B46C1',
    secondary: colors.secondary || '#4299E1',
    accent: colors.accent || '#ED64A6'
  };
};
