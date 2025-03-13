import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";
export const FollowingList = ({ userId }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const { data: followersData, error: followersError } = useQuery({
        queryKey: ['followers', userId],
        queryFn: async () => {
            console.log('Fetching followers data for userId:', userId);
            // Step 1: Fetch followee IDs and their associated timestamps
            const controller = new AbortController();
            const { data: followeeIdsData, error: followeeIdsError } = await supabase
                .from('followers')
                .select('followee_id, created_at, updated_at')
                .eq('follower_id', userId)
                .abortSignal(controller.signal);
            if (followeeIdsError) {
                console.warn('Supabase followeeIdsError for user:', userId, followeeIdsError);
                return Promise.reject(followeeIdsError); // Reject with the actual error
            }
            if (!followeeIdsData || !Array.isArray(followeeIdsData)) {
                console.warn('Unexpected data format for followeeIdsData for user:', userId, followeeIdsData);
                return Promise.reject(new Error('Unexpected data format for followee IDs'));
            }
            const ids = followeeIdsData.map(item => item.followee_id);
            // Step 2: Fetch profiles based on followee IDs
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select(`id, avatar_url, created_at, full_name, role, username`)
                .in('id', ids)
                .abortSignal(controller.signal);
            if (profilesError) {
                console.warn('Supabase profilesError for followee_ids:', ids, profilesError);
                return Promise.reject(profilesError); // Reject with the actual error
            }
            if (!profilesData || !Array.isArray(profilesData)) {
                console.warn('Unexpected data format for profilesData for followee_ids:', ids, profilesData);
                return Promise.reject(new Error('Unexpected data format for profiles'));
            }
            console.log('Profiles data:', profilesData);
            // Step 3: Map profiles to followers with correct timestamps
            return followeeIdsData.map(followee => {
                const profile = profilesData.find(p => p.id === followee.followee_id);
                if (!profile) {
                    console.warn('Profile not found for followee_id:', followee.followee_id);
                    return null;
                }
                return {
                    id: followee.id,
                    follower_id: userId,
                    followee_id: followee.followee_id,
                    created_at: followee.created_at,
                    updated_at: followee.updated_at,
                    followee: profile
                };
            }).filter((follower) => follower !== null);
        },
        enabled: !!userId,
    });
    const following = followersData;
    const filteredFollowing = following?.filter((follow) => {
        if (!searchTerm.trim())
            return true;
        const searchLower = searchTerm.toLowerCase().trim();
        console.log('Searching for:', searchLower);
        console.log('Current follow data:', {
            fullName: follow.followee.full_name,
            username: follow.followee.username
        });
        const fullName = (follow.followee?.full_name || '').toLowerCase();
        const username = (follow.followee?.username || '').toLowerCase();
        const matches = fullName.includes(searchLower) || username.includes(searchLower);
        console.log('Matches:', matches);
        return matches;
    });
    console.log('Filtered following count:', filteredFollowing?.length);
    const handleProfileClick = (profile) => {
        if (profile.role === 'musician') {
            // For musicians, first get their musician profile ID
            supabase
                .from('musicians')
                .select('id')
                .eq('user_id', profile.id)
                .single()
                .then(({ data: musician, error }) => {
                if (!error && musician) {
                    navigate(`/musicians/${musician.id}`);
                }
                else {
                    // Fallback to regular profile if no musician profile found
                    navigate(`/profile/${profile.id}`);
                }
            })
                .catch(error => {
                console.error('Error fetching musician profile:', error);
                navigate(`/profile/${profile.id}`);
            });
        }
        else {
            // For non-musicians, go to regular profile
            navigate(`/profile/${profile.id}`);
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(Input, { placeholder: "Search following...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "mb-4 bg-background" }), filteredFollowing?.map((follow) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-card/50 rounded-lg animate-fade-in", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Avatar, { className: "h-12 w-12 ring-1 ring-border", children: [_jsx(AvatarImage, { src: follow.followee.avatar_url || undefined, alt: follow.followee.username || 'User avatar', className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: _jsx(User, { className: "h-6 w-6" }) })] }), _jsx("span", { className: "font-medium", children: follow.followee?.full_name || follow.followee?.username })] }), _jsx(Button, { variant: "ghost", onClick: () => follow.followee && handleProfileClick(follow.followee), children: "View Profile" })] }, follow.followee.id))), !filteredFollowing?.length && (_jsx("p", { className: "text-center text-muted-foreground", children: searchTerm ? "No matching results" : "You are not following anyone yet" }))] }));
};
