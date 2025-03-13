import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";
export const FollowersList = ({ userId }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const { data: followers } = useQuery({
        queryKey: ['followers', userId],
        queryFn: async () => {
            console.log('Fetching followers data for userId:', userId);
            const { data, error } = await supabase
                .from('followers')
                .select(`
          follower:profiles!followers_follower_id_fkey (
            id,
            username,
            full_name,
            avatar_url,
            role
          )
        `)
                .eq('followed_id', userId);
            if (error) {
                console.error('Error fetching followers:', error);
                throw error;
            }
            console.log('Followers data:', data);
            return data;
        },
        enabled: !!userId,
    });
    const filteredFollowers = followers?.filter(follow => {
        if (!searchTerm.trim())
            return true;
        const searchLower = searchTerm.toLowerCase().trim();
        const fullName = (follow.follower.full_name || '').toLowerCase();
        const username = (follow.follower.username || '').toLowerCase();
        return fullName.includes(searchLower) || username.includes(searchLower);
    });
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
            });
        }
        else {
            // For non-musicians, go to regular profile
            navigate(`/profile/${profile.id}`);
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(Input, { placeholder: "Search followers...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "mb-4 bg-background" }), filteredFollowers?.map((follow) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-card/50 rounded-lg animate-fade-in", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Avatar, { className: "h-12 w-12 ring-1 ring-border", children: [_jsx(AvatarImage, { src: follow.follower.avatar_url || undefined, alt: follow.follower.username || 'User avatar', className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: _jsx(User, { className: "h-6 w-6" }) })] }), _jsx("span", { className: "font-medium", children: follow.follower.full_name || follow.follower.username })] }), _jsx(Button, { variant: "ghost", onClick: () => handleProfileClick(follow.follower), children: "View Profile" })] }, follow.follower.id))), !filteredFollowers?.length && (_jsx("p", { className: "text-center text-muted-foreground", children: searchTerm ? "No matching results" : "No followers yet" }))] }));
};
