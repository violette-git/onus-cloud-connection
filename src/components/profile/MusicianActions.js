import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FollowButton } from "./musician-actions/FollowButton";
import { CollaborationButton } from "./musician-actions/CollaborationButton";
import { MessageDialog } from "./musician-actions/MessageDialog";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
export const MusicianActions = ({ musicianUserId, musicianId }) => {
    const { user } = useAuth();
    // If this is the current user's profile, or no user is logged in, don't show any actions
    if (!user || user.id === musicianUserId)
        return null;
    const { data: isFollowing } = useQuery({
        queryKey: ['following', musicianUserId, user?.id],
        queryFn: async () => {
            if (!user?.id || !musicianUserId)
                return false;
            const { data } = await supabase
                .from('followers')
                .select('*')
                .eq('follower_id', user.id)
                .eq('followed_id', musicianUserId)
                .maybeSingle();
            return !!data;
        },
        enabled: !!user && !!musicianUserId,
    });
    const { data: userProfile } = useQuery({
        queryKey: ['profile', user?.id],
        queryFn: async () => {
            if (!user?.id)
                return null;
            const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            return data;
        },
        enabled: !!user,
    });
    const { data: collaborationStatus } = useQuery({
        queryKey: ['collaboration-status', musicianId, user?.id],
        queryFn: async () => {
            if (!user?.id)
                return null;
            const { data: requestorStatus } = await supabase
                .from('collaborators')
                .select('status')
                .eq('requester_id', user.id)
                .eq('musician_id', musicianId)
                .maybeSingle();
            if (requestorStatus) {
                return requestorStatus.status;
            }
            const { data: currentUserMusician } = await supabase
                .from('musicians')
                .select('id')
                .eq('user_id', user.id)
                .single();
            if (currentUserMusician) {
                const { data: musicianStatus } = await supabase
                    .from('collaborators')
                    .select('status')
                    .eq('musician_id', currentUserMusician.id)
                    .eq('requester_id', musicianUserId)
                    .maybeSingle();
                if (musicianStatus) {
                    return musicianStatus.status;
                }
            }
            return null;
        },
        enabled: !!user && !!musicianId && userProfile?.role === 'musician',
    });
    return (_jsx("div", { className: "flex flex-col gap-2", children: _jsxs("div", { className: "flex justify-center items-center gap-2", children: [_jsx(FollowButton, { userId: user.id, musicianUserId: musicianUserId || '', isFollowing: !!isFollowing }), userProfile?.role === 'musician' && (_jsx(CollaborationButton, { userId: user.id, musicianId: musicianId, collaborationStatus: collaborationStatus })), _jsx(MessageDialog, { recipientId: musicianUserId || '', children: _jsxs(Button, { variant: "outline", size: "sm", className: "w-[120px] flex items-center gap-1 text-xs", children: [_jsx(MessageCircle, { className: "h-3 w-3" }), _jsx("span", { children: "Message" })] }) })] }) }));
};
