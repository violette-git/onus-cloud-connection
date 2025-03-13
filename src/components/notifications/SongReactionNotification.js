import { jsx as _jsx } from "react/jsx-runtime";
import { Heart, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
export const SongReactionNotification = ({ notification, navigate }) => {
    const actorName = notification.actor?.full_name || notification.actor?.username;
    const isLike = notification.reaction_type === 'like';
    return {
        icon: isLike ?
            _jsx(Heart, { className: "h-5 w-5 text-red-500" }) :
            _jsx(ThumbsDown, { className: "h-5 w-5 text-gray-500" }),
        message: `${actorName} ${isLike ? 'liked' : 'disliked'} your song`,
        action: (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => navigate(`/songs/${notification.reference_id}`), children: "View Song" })),
    };
};
