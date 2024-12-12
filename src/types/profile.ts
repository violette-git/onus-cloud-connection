export interface SocialLinks {
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
  social_links: SocialLinks;
}