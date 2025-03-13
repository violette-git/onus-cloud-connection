import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { FollowNotification } from "./FollowNotification";
import { CollaborationNotification } from "./CollaborationNotification";
import { SongReactionNotification } from "./SongReactionNotification";
import { useNavigate } from "react-router-dom";
export const NotificationCard = ({ notification, currentUserId }) => {
    const navigate = useNavigate();
    const getNotificationContent = (notification) => {
        switch (notification.type) {
            case 'follow':
                return FollowNotification({ notification, navigate });
            case 'collaboration_request':
                return CollaborationNotification({ notification, currentUserId, navigate });
            case 'song_reaction':
                return SongReactionNotification({ notification, navigate });
            default:
                return null;
        }
    };
    const content = getNotificationContent(notification);
    if (!content)
        return null;
    return (_jsx(Card, { className: "p-4", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsxs(Avatar, { className: "h-12 w-12 ring-1 ring-border", children: [_jsx(AvatarImage, { src: notification.actor?.avatar_url, alt: notification.actor?.username || 'User avatar', className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { className: "text-base", children: (notification.actor?.username || 'U')[0].toUpperCase() })] }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [content.icon, _jsx("p", { className: "text-sm truncate", children: content.message })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: new Date(notification.created_at).toLocaleDateString() })] }), content.action] }) }));
};
