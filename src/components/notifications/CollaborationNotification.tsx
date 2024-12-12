import { UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationProps } from "./types";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const CollaborationNotification = ({ notification, currentUserId }: NotificationProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const actorName = notification.actor?.full_name || notification.actor?.username;
  const isOwnRequest = notification.actor_id === currentUserId;

  const cancelCollaborationMutation = useMutation({
    mutationFn: async () => {
      if (!notification.reference_id) throw new Error("No reference ID");
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('requester_id', notification.actor_id)
        .eq('musician_id', notification.reference_id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['collaboration-status', notification.reference_id, notification.actor_id] 
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Request Cancelled",
        description: "Your collaboration request has been cancelled",
      });
    },
  });

  return {
    icon: <UserPlus className="h-5 w-5 text-green-500" />,
    message: `${actorName} wants to collaborate with you`,
    action: isOwnRequest ? (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => cancelCollaborationMutation.mutate()}
        disabled={cancelCollaborationMutation.isPending}
      >
        <X className="h-4 w-4 mr-1" />
        Cancel Request
      </Button>
    ) : (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/musicians/${notification.reference_id}`)}
      >
        View Request
      </Button>
    ),
  };
};