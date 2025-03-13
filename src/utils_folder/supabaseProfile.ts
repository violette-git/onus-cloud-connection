// utils/supabaseProfile.ts (or a similar utility file)

import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/profile";
import { ensureCommentPreferences, ensureSocialLinks, ensureThemeColors } from "@/types/database";

export const fetchProfileData = async (userId: string | undefined): Promise<Profile | null> => {
  if (!userId) {
    console.warn("No user ID provided for fetching profile data.");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, email, bio, first_name, last_name, location, website, social_links, comment_preferences, theme_colors, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile data from Supabase:", error);
      throw error; // Re-throw the error to be caught by useQuery
    }

    if (!data) {
      console.warn(`No profile data found for user ID: ${userId}`);
      return null; // Handle case where no data is returned
    }

    return {
      ...data,
      email: data.email || '',
      bio: data.bio || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      location: data.location || '',
      website: data.website || '',
      social_links: ensureSocialLinks(data.social_links),
      comment_preferences: ensureCommentPreferences(data.comment_preferences),
      theme_colors: ensureThemeColors(data.theme_colors),
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    } as unknown as Profile;

  } catch (error) {
    console.error("Error in fetchProfileData:", error);
    return null; // Or handle error as needed, maybe re-throw or return a specific error object
  }
};