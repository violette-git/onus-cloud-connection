import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationProps } from "./types";

export const FollowNotification = ({ notification, navigate }: NotificationProps) => {
  const actorName = notification.actor?.full_name || notification.actor?.username;

  return {
    icon: <Users className="h-5 w-5 text-blue-500" />,
    message: `${actorName} started following you`,
    action: (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/profile/${notification.actor_id}`)}
      >
        View Profile
      </Button>
    ),
  };
};