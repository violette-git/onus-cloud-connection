import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, Navigate } from "react-router-dom";
import { ProfileView } from "./profile/ProfileView";
import { useProfileMutation } from "@/hooks/useProfileMutation";
import type { Profile as ProfileType } from "@/types/profile";
import { ensureCommentPreferences, ensureSocialLinks, ensureThemeColors } from "@/types/database";

export const Profile = () => {
  const { user } = useAuth();
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
      
      return {
        ...data,
        social_links: ensureSocialLinks(data.social_links),
        comment_preferences: ensureCommentPreferences(data.comment_preferences),
        theme_colors: ensureThemeColors(data.theme_colors)
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

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-banner-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfileMutation.mutateAsync({ 
        id: user.id,
        banner_url: publicUrl 
      });
    } catch (error) {
      console.error('Error uploading banner:', error);
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
      onBannerUpload={handleBannerUpload}
      onThemeUpdate={(colors) => updateProfileMutation.mutateAsync({ 
        id: profile.id,
        theme_colors: colors 
      })}
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
    />
  );
};