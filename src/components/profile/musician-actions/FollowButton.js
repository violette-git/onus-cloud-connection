import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { UserPlus2, UserMinus2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const FollowButton = ({ userId, musicianUserId, isFollowing }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const followMutation = useMutation({
        mutationFn: async () => {
            if (!userId || !musicianUserId)
                throw new Error("Not authenticated");
            if (isFollowing) {
                const { error } = await supabase
                    .from('followers')
                    .delete()
                    .eq('follower_id', userId)
                    .eq('followed_id', musicianUserId);
                if (error)
                    throw error;
            }
            else {
                const { error } = await supabase
                    .from('followers')
                    .insert({ follower_id: userId, followed_id: musicianUserId });
                if (error)
                    throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['following', musicianUserId, userId] });
            toast({
                title: isFollowing ? "Unfollowed" : "Following",
                description: isFollowing ? "You've unfollowed this musician" : "You're now following this musician",
            });
        },
    });
    return (_jsx(Button, { variant: isFollowing ? "outline" : "default", onClick: () => followMutation.mutate(), disabled: followMutation.isPending, size: "sm", className: "w-[120px] flex items-center gap-1 text-xs", children: isFollowing ? (_jsxs(_Fragment, { children: [_jsx(UserMinus2, { className: "h-3 w-3" }), _jsx("span", { children: "Unfollow" })] })) : (_jsxs(_Fragment, { children: [_jsx(UserPlus2, { className: "h-3 w-3" }), _jsx("span", { children: "Follow" })] })) }));
};
