import { Heart, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationProps } from "./types";

export const SongReactionNotification = ({ notification, navigate }: NotificationProps) => {
  const actorName = notification.actor?.full_name || notification.actor?.username;
  const isLike = notification.reaction_type === 'like';

  return {
    icon: isLike ? 
      <Heart className="h-5 w-5 text-red-500" /> : 
      <ThumbsDown className="h-5 w-5 text-gray-500" />,
    message: `${actorName} ${isLike ? 'liked' : 'disliked'} your song`,
    action: (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/songs/${notification.reference_id}`)}
      >
        View Song
      </Button>
    ),
  };
};