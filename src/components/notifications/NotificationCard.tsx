import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Notification } from "./types";
import { FollowNotification } from "./FollowNotification";
import { CollaborationNotification } from "./CollaborationNotification";
import { SongReactionNotification } from "./SongReactionNotification";
import { useNavigate } from "react-router-dom";

interface NotificationCardProps {
  notification: Notification;
  currentUserId?: string;
}

export const NotificationCard = ({ notification, currentUserId }: NotificationCardProps) => {
  const navigate = useNavigate();
  
  const getNotificationContent = (notification: Notification) => {
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
  if (!content) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={notification.actor?.avatar_url} />
          <AvatarFallback>
            {(notification.actor?.username || 'U')[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {content.icon}
            <p className="text-sm">{content.message}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(notification.created_at).toLocaleDateString()}
          </p>
        </div>
        {content.action}
      </div>
    </Card>
  );
};