import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, Navigate } from "react-router-dom";
import { ProfileView } from "./profile/ProfileView";
import { useProfileMutation } from "@/hooks/useProfileMutation";
import type { Profile as ProfileType } from "@/types/profile";
import { ensureCommentPreferences, ensureSocialLinks, ensureThemeColors } from "@/types/database";

export const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { username: urlUsername } = useParams();
  const queryClient = useQueryClient();
  
  // If we're on /profile without a username, this is the private profile view
  const isPrivateView = !urlUsername;
  
  // First, fetch profile by username if provided in URL
  const { data: profileByUsername, isLoading: isUsernameLoading } = useQuery({
    queryKey: ['profile-by-username', urlUsername],
    queryFn: async () => {
      if (!urlUsername) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', urlUsername)
        .single();
      
      if (error) return null;
      return data;
    },
    enabled: !!urlUsername,
  });

  // For private view, use user.id, for public view use the found profile id
  const targetUserId = isPrivateView ? user?.id : profileByUsername?.id;

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
      
      return {
        ...data,
        social_links: ensureSocialLinks(data.social_links),
        comment_preferences: ensureCommentPreferences(data.comment_preferences),
        theme_colors: ensureThemeColors(data.theme_colors)
      } as ProfileType;
    },
    enabled: !!targetUserId && !authLoading,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
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
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const updateProfileMutation = useProfileMutation();

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

      await updateProfileMutation.mutateAsync({ 
        id: user.id,
        avatar_url: publicUrl 
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const isLoading = authLoading || isUsernameLoading || isProfileLoading;

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center h-screen">Profile not found</div>;
  }

  // Check if this is a private profile and the viewer is not the owner
  const isPrivateProfile = profile.visibility === 'private' && user?.id !== profile.id;
  if (isPrivateProfile) {
    return <div className="flex items-center justify-center h-screen">This profile is private</div>;
  }

  // If this is a public musician profile view, redirect to the musician profile page
  const shouldRedirectToMusicianProfile = 
    !isPrivateView && 
    profile.role === 'musician';

  if (shouldRedirectToMusicianProfile && musician) {
    return <Navigate to={`/musicians/${musician.id}`} replace />;
  }

  const isOwner = user?.id === profile.id;

  // Add a listener for extension messages
  useState(() => {
    const handleExtensionMessage = async (event: MessageEvent) => {
      if (event.data.type === 'SUNO_ACCOUNT_LINKED' && 
          event.data.sunoUsername && 
          event.data.sunoEmail &&
          user?.id) {
        await updateProfileMutation.mutateAsync({
          id: user.id,
          suno_username: event.data.sunoUsername,
          suno_email: event.data.sunoEmail
        });
        
        // Invalidate queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    };

    window.addEventListener('message', handleExtensionMessage);
    return () => window.removeEventListener('message', handleExtensionMessage);
  }, [user?.id]);

  return (
    <ProfileView
      profile={profile}
      musician={musician}
      isOwner={isOwner}
      onImageUpload={handleImageUpload}
      onSocialLinksUpdate={(newLinks) => updateProfileMutation.mutateAsync({ 
        id: profile.id,
        social_links: newLinks 
      })}
      onBecomeMusicianClick={() => updateProfileMutation.mutateAsync({ 
        id: profile.id,
        role: 'musician' 
      })}
      onMusicianProfileCreated={() => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['musician'] });
      }}
      updateProfileMutation={updateProfileMutation}
    />
  );
};
