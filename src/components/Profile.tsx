import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ProfileHeader } from "./profile/ProfileHeader";
import { ProfileActions } from "./profile/ProfileActions";
import { ProfileContent } from "./profile/ProfileContent";
import { useParams, Navigate } from "react-router-dom";
import type { Profile as ProfileType, SocialLinks } from "@/types/profile";

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
  
  // If no profileId is provided in URL, use the current user's ID
  const targetUserId = profileId || user?.id;

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      console.log('Fetching profile for targetUserId:', targetUserId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();
      
      if (error) throw error;
      console.log('Profile data:', data);
      return {
        ...data,
        social_links: data.social_links || defaultSocialLinks
      } as ProfileType;
    },
    enabled: !!targetUserId,
  });

  const { data: musician, isLoading: isMusicianLoading } = useQuery({
    queryKey: ['musician', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      console.log('Fetching musician data for targetUserId:', targetUserId);
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
      console.log('Musician data:', data);
      return data;
    },
    enabled: !!targetUserId && !!profile?.role && profile.role === 'musician',
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<ProfileType>) => {
      if (!user?.id) throw new Error("No user");
      const { error } = await supabase
        .from('profiles')
        .update(updates)
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

  const handleSocialLinksUpdate = async (newLinks: SocialLinks) => {
    try {
      await updateProfileMutation.mutateAsync({ social_links: newLinks });
    } catch (error) {
      console.error('Error updating social links:', error);
    }
  };

  const handleMusicianProfileCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
    queryClient.invalidateQueries({ queryKey: ['musician'] });
  };

  // Show loading state while profile is being fetched
  if (isProfileLoading) {
    return <div className="flex items-center justify-center h-screen">Loading profile...</div>;
  }

  // Show error state if no profile is found
  if (!profile) {
    return <div className="flex items-center justify-center h-screen">Profile not found</div>;
  }

  // Only redirect if:
  // 1. We're viewing someone else's profile (profileId exists and isn't the current user)
  // 2. That person is a musician
  // 3. We have their musician data
  const shouldRedirectToMusicianProfile = 
    profileId && // We're viewing a specific profile
    profileId !== user?.id && // It's not our own profile
    profile.role === 'musician' && // The profile is a musician
    musician; // We have the musician data

  if (shouldRedirectToMusicianProfile) {
    return <Navigate to={`/musicians/${musician.id}`} replace />;
  }

  const isOwner = user?.id === profile.id;

  return (
    <div className="animate-fade-in pb-12">
      <ProfileHeader 
        profile={profile}
        musician={musician}
        isOwner={isOwner}
        onImageUpload={handleImageUpload}
      />

      <div className="mt-24">
        <ProfileActions 
          profile={profile}
          isOwner={isOwner}
          onSocialLinksUpdate={handleSocialLinksUpdate}
          onBecomeMusicianClick={async () => {
            try {
              await updateProfileMutation.mutateAsync({ role: 'musician' });
            } catch (error) {
              console.error('Error becoming musician:', error);
            }
          }}
        />

        {profile.role === 'musician' && (
          <ProfileContent 
            musician={musician} 
            onProfileCreated={handleMusicianProfileCreated}
          />
        )}
      </div>
    </div>
  );
};