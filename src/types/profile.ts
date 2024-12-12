import type { Json } from "@/integrations/supabase/types";

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