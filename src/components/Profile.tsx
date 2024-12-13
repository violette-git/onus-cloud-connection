import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useParams, Navigate } from "react-router-dom";
import { ProfileView } from "./profile/ProfileView";
import type { Profile as ProfileType, SocialLinks } from "@/types/profile";
import { ensureCommentPreferences, ensureSocialLinks } from "@/types/database";

const defaultSocialLinks: SocialLinks = {
  instagram: "",
  youtube: "",
  linkedin: ""
};

export const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id: profileId } = useParams();
  
  const targetUserId = profileId || user?.id;

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();
      
      if (error) throw error;
      
      // Ensure proper typing of JSON fields
      return {
        ...data,
        social_links: ensureSocialLinks(data.social_links),
        comment_preferences: ensureCommentPreferences(data.comment_preferences)
      } as ProfileType;
    },
    enabled: !!targetUserId,
  });

  const { data: musician, isLoading: isMusicianLoading } = useQuery({
    queryKey: ['musician', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      const { data, error } = await supabase
        .from('musicians')
        .select(`
          *,
          musician_genres (
            genre: genres (name)
          ),
          songs (
            id,
            title,
            url,
            created_at,
            updated_at
          ),
          videos (
            id,
            title,
            url,
            platform,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', targetUserId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!targetUserId && !!profile?.role && profile.role === 'musician',
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<ProfileType>) => {
      if (!user?.id) throw new Error("No user");
      
      // Convert the updates to a format that matches the database schema
      const dbUpdates: Record<string, unknown> = {
        ...updates,
        comment_preferences: updates.comment_preferences ? 
          { disable_comments: updates.comment_preferences.disable_comments } : 
          { disable_comments: false },
        social_links: updates.social_links || defaultSocialLinks
      };

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfileMutation.mutateAsync({ avatar_url: publicUrl });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not upload image. Please try again.",
      });
      console.error('Error uploading image:', error);
    }
  };

  if (isProfileLoading) {
    return <div className="flex items-center justify-center h-screen">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center h-screen">Profile not found</div>;
  }

  const shouldRedirectToMusicianProfile = 
    profileId && 
    profileId !== user?.id && 
    profile.role === 'musician' && 
    musician;

  if (shouldRedirectToMusicianProfile) {
    return <Navigate to={`/musicians/${musician.id}`} replace />;
  }

  const isOwner = user?.id === profile.id;

  return (
    <ProfileView
      profile={profile}
      musician={musician}
      isOwner={isOwner}
      onImageUpload={handleImageUpload}
      onSocialLinksUpdate={async (newLinks) => {
        try {
          await updateProfileMutation.mutateAsync({ social_links: newLinks });
        } catch (error) {
          console.error('Error updating social links:', error);
        }
      }}
      onBecomeMusicianClick={async () => {
        try {
          await updateProfileMutation.mutateAsync({ role: 'musician' });
        } catch (error) {
          console.error('Error becoming musician:', error);
        }
      }}
      onMusicianProfileCreated={() => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['musician'] });
      }}
    />
  );
};
