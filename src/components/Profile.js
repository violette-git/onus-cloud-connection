import { jsx as _jsx } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, Navigate } from "react-router-dom";
import { ProfileView } from "./profile/ProfileView";
import { useProfileMutation } from "@/hooks/useProfileMutation";
import { useEffect } from "react";
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
            if (!urlUsername)
                return null;
            const { data, error } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', urlUsername)
                .single();
            if (error)
                throw error;
            return data;
        },
        enabled: !!urlUsername,
    });
    // For private view, use user.id, for public view use the found profile id
    const targetUserId = isPrivateView ? user?.id : profileByUsername?.id;
    const { data: profileData, isLoading: isProfileLoading, error: profileError } = useQuery({
        queryKey: ['profile', targetUserId],
        queryFn: async () => {
            if (!targetUserId)
                return null;
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, email, role, created_at, first_name, last_name, location, website, full_name, visibility')
                .eq('id', targetUserId)
                .single();
            if (error) {
                console.error('Error fetching profile:', error);
                throw error; // Throw the error to be handled by useQuery
            }
            return data;
        },
        enabled: !!targetUserId && !authLoading,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
    const profile = profileData; // profileData is already typed as ProfileType | null
    const { data: musicianData, isLoading: isMusicianLoading, error: musicianError } = useQuery({
        queryKey: ['musician', targetUserId],
        queryFn: async () => {
            if (!targetUserId)
                return null;
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
    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !user?.id)
            return;
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}-${Math.random()}.${fileExt}`;
            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });
            if (uploadError)
                throw uploadError;
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);
            // Removed avatar_url update
        }
        catch (error) {
            console.error('Error uploading image:', error);
        }
    };
    const isLoading = authLoading || isUsernameLoading || isProfileLoading || !profile;
    // Add a listener for extension messages
    useEffect(() => {
        const handleExtensionMessage = async (event) => {
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
        return _jsx("div", { className: "flex items-center justify-center h-screen", children: "Loading profile..." });
    }
    if (profileError) {
        return _jsx("div", { className: "flex items-center justify-center h-screen", children: "Error loading profile" });
    }
    if (profile) {
        const { id, username, email, role, created_at, first_name, last_name, location, website, full_name, visibility } = profile;
        // Check if this is a private profile and the viewer is not the owner
        const isPrivateProfile = visibility === 'private' && user?.id !== id;
        if (isPrivateProfile) {
            return _jsx("div", { className: "flex items-center justify-center h-screen", children: "This profile is private" });
        }
        // If this is a public musician profile view, redirect to the musician profile page
        const shouldRedirectToMusicianProfile = !isPrivateView && role === 'musician';
        if (shouldRedirectToMusicianProfile && musicianData) {
            return _jsx(Navigate, { to: `/musicians/${musicianData.id}`, replace: true });
        }
        const isOwner = user?.id === id;
        return (_jsx(ProfileView, { profile: profile, musician: musicianData, isOwner: isOwner, onImageUpload: handleImageUpload, onSocialLinksUpdate: (newLinks) => updateProfileMutation.mutateAsync({
                id,
                social_links: newLinks
            }), onBecomeMusicianClick: () => updateProfileMutation.mutateAsync({
                id,
                role: 'musician'
            }), onMusicianProfileCreated: () => {
                queryClient.invalidateQueries({ queryKey: ['profile'] });
                queryClient.invalidateQueries({ queryKey: ['musician'] });
            }, updateProfileMutation: updateProfileMutation }));
    }
    return _jsx("div", { className: "flex items-center justify-center h-screen", children: "Profile not found" });
};
