import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, Navigate } from "react-router-dom";
import { ProfileView } from "./profile/ProfileView";
import { useProfileMutation } from "@/hooks/useProfileMutation";
import type { Profile as ProfileType, SocialLinks } from "@/types/profile"; // Import SocialLinks here
import { useState, useEffect } from "react";

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
      if (error) throw error;
      return data;
    },
    enabled: !!urlUsername,
  });

  // For private view, use user.id, for public view use the found profile id
  const targetUserId = isPrivateView ? user?.id : profileByUsername?.id;

  const { data: profileData, isLoading: isProfileLoading, error: profileError } = useQuery<ProfileType | null, unknown>({
    queryKey: ['profile', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, email, role, created_at, first_name, last_name, location, website, full_name, visibility')
        .eq('id', targetUserId)
        .single();
      if (error) {
        console.error('Error fetching profile:', error);
        throw error; // Throw the error to be handled by useQuery
      }
return data as unknown as ProfileType | null;
    },
    enabled: !!targetUserId && !authLoading,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const profile = profileData; // profileData is already typed as ProfileType | null

  const { data: musicianData, isLoading: isMusicianLoading, error: musicianError } = useQuery<any, unknown>({
    queryKey: ['musician', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      const { data, error } = await supabase
        .from('musicians')
        .select(`*
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
      if (error) {
        console.error('Error fetching musician data:', error);
        throw error; // Throw the error to be handled by useQuery
      }
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

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Removed avatar_url update
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const isLoading = authLoading || isUsernameLoading || isProfileLoading || !profile;

  // Add a listener for extension messages
  useEffect(() => {
    const handleExtensionMessage = async (event: MessageEvent) => {
      if (event.data.type === 'SUNO_ACCOUNT_LINKED' && event.data.sunoUsername && user?.id) {
        await updateProfileMutation.mutateAsync({
          id: user.id,
          suno_username: event.data.sunoUsername,
        });

        // Invalidate queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    };

    window.addEventListener('message', handleExtensionMessage);
    return () => window.removeEventListener('message', handleExtensionMessage);
  }, [user?.id]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading profile...</div>;
  }

  if (profileError) {
    return <div className="flex items-center justify-center h-screen">Error loading profile</div>;
  }

  if (profile) {
    const { id, username, email, role, created_at, first_name, last_name, location, website, full_name, visibility } = profile;

    // Check if this is a private profile and the viewer is not the owner
    const isPrivateProfile = visibility === 'private' && user?.id !== id;
    if (isPrivateProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center text-gray-600 dark:text-gray-400">
          This profile is private
        </div>
      </div>
    );
    }

    // If this is a public musician profile view, redirect to the musician profile page
    const shouldRedirectToMusicianProfile = !isPrivateView && role === 'musician';
    if (shouldRedirectToMusicianProfile && musicianData) {
      return <Navigate to={`/musicians/${musicianData.id}`} replace />;
    }

    const isOwner = user?.id === id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
      <div className="w-full md:w-auto space-y-4">
        <img 
          src={profile.avatar_url || '/default-avatar.png'} 
          alt={`${profile.full_name}'s avatar`} 
          className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover mx-auto"
        />
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {profile.full_name}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {profile.bio || 'No bio available'}
          </p>
        </div>
      </div>
      
      <div className="flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400">Email:</span>
              <span className="text-gray-900 dark:text-gray-100 break-all">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400">Joined:</span>
              <span className="text-gray-900 dark:text-gray-100">
                {new Date(profile.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      <ProfileView
      profile={profile}
      musician={musicianData}
      isOwner={isOwner}
      onImageUpload={handleImageUpload}
      onSocialLinksUpdate={(newLinks: SocialLinks) => updateProfileMutation.mutateAsync({ 
        id,
        social_links: newLinks
      })}
      onBecomeMusicianClick={() => updateProfileMutation.mutateAsync({ 
        id,
        role: 'musician' 
      })}
      onMusicianProfileCreated={() => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['musician'] });
      }}
      updateProfileMutation={updateProfileMutation}
    />
  </div>
);
  }

  return <div className="flex items-center justify-center h-screen">Profile not found</div>;
};
