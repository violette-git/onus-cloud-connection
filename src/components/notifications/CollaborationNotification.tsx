import { UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationProps } from "./types";
import { useCancelCollaboration } from "@/hooks/useCancelCollaboration";
import { useNavigate } from "react-router-dom";

export const CollaborationNotification = ({ notification, currentUserId }: NotificationProps) => {
  const navigate = useNavigate();
  const { mutate: cancelCollaboration, isPending } = useCancelCollaboration();
  const actorName = notification.actor?.full_name || notification.actor?.username;
  const isOwnRequest = notification.actor_id === currentUserId;

  return {
    icon: <UserPlus className="h-5 w-5 text-green-500" />,
    message: `${actorName} wants to collaborate with you`,
    action: isOwnRequest ? (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (notification.reference_id) {
            cancelCollaboration({
              requesterId: notification.actor_id,
              musicianId: notification.reference_id,
            });
          }
        }}
        disabled={isPending}
      >
        <X className="h-4 w-4 mr-1" />
        Cancel Request
      </Button>
    ) : (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/musician/${notification.reference_id}`)}
      >
        View Request
      </Button>
    ),
  };
};