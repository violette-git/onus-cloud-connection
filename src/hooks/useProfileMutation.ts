import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Profile } from "@/types/profile";

const defaultSocialLinks = {
  instagram: "",
  youtube: "",
  linkedin: ""
};

export const useProfileMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!updates.id) throw new Error("No user ID provided");
      
      // Convert the updates to a format that matches the database schema
      const dbUpdates: Record<string, unknown> = {
        ...updates,
        comment_preferences: updates.comment_preferences ? 
          { disable_comments: updates.comment_preferences.disable_comments } : 
          { disable_comments: false },
        social_links: updates.social_links || defaultSocialLinks,
        theme_colors: updates.theme_colors || {
          primary: '#6B46C1',
          secondary: '#4299E1',
          accent: '#ED64A6'
        }
      };

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', updates.id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      // Invalidate all relevant query variations
      queryClient.invalidateQueries({ 
        queryKey: ['profile', variables.id],
        refetchType: 'active'
      });
      queryClient.invalidateQueries({
        queryKey: ['profile'],
        exact: true
      });
      toast({
        title: "Success!",
        description: "Your profile has been updated.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update profile. Please try again.",
      });
      console.error('Error updating profile:', error);
    },
  });
};
