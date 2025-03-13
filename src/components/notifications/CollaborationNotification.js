import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
export const CollaborationNotification = ({ notification, currentUserId }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const actorName = notification.actor?.full_name || notification.actor?.username;
    const isOwnRequest = notification.actor_id === currentUserId;
    const cancelCollaborationMutation = useMutation({
        mutationFn: async () => {
            if (!notification.reference_id)
                throw new Error("No reference ID");
            console.log('Cancelling collaboration request:', {
                actorId: notification.actor_id,
                musicianId: notification.reference_id
            });
            const { data, error } = await supabase
                .from('collaborators')
                .delete()
                .eq('requester_id', notification.actor_id)
                .eq('musician_id', notification.reference_id)
                .select();
            console.log('Delete response:', { data, error });
            if (error)
                throw error;
            return true;
        },
        onSuccess: () => {
            console.log('Mutation successful, invalidating queries');
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
        icon: _jsx(UserPlus, { className: "h-5 w-5 text-green-500" }),
        message: `${actorName} wants to collaborate with you`,
        action: isOwnRequest ? (_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => {
                console.log('Cancel button clicked', {
                    notificationId: notification.id,
                    actorId: notification.actor_id,
                    referenceId: notification.reference_id
                });
                cancelCollaborationMutation.mutate();
            }, disabled: cancelCollaborationMutation.isPending, children: [_jsx(X, { className: "h-4 w-4 mr-1" }), "Cancel Request"] })) : (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => navigate(`/musicians/${notification.reference_id}`), children: "View Request" })),
    };
};
