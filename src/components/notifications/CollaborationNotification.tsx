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
      console.log('Cancelling collaboration request:', {
        actorId: notification.actor_id,
        musicianId: notification.reference_id
      });
      
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('requester_id', notification.actor_id)
        .eq('musician_id', notification.reference_id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      // Invalidate both the collaboration status and notifications queries
      queryClient.invalidateQueries({ 
        queryKey: ['collaboration-status', notification.reference_id, notification.actor_id] 
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      
      // Also invalidate the specific musician's collaborators
      queryClient.invalidateQueries({ 
        queryKey: ['collaboration-requests', notification.reference_id] 
      });
      
      toast({
        title: "Request Cancelled",
        description: "Your collaboration request has been cancelled",
      });
    },
    onError: (error) => {
      console.error('Error cancelling collaboration:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel collaboration request. Please try again.",
      });
    }
  });

  return {
    icon: <UserPlus className="h-5 w-5 text-green-500" />,
    message: `${actorName} wants to collaborate with you`,
    action: isOwnRequest ? (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          console.log('Cancel button clicked');
          cancelCollaborationMutation.mutate();
        }}
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