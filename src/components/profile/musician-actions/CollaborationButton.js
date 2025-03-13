import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HandshakeIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const CollaborationButton = ({ userId, musicianId, collaborationStatus }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isRequesting, setIsRequesting] = useState(false);
    const collaborateMutation = useMutation({
        mutationFn: async () => {
            if (!userId)
                throw new Error("Not authenticated");
            console.log('Sending collaboration request:', { userId, musicianId });
            const { error } = await supabase
                .from('collaborators')
                .insert({ requester_id: userId, musician_id: musicianId });
            if (error)
                throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collaboration-status', musicianId, userId] });
            toast({
                title: "Request Sent",
                description: "Your collaboration request has been sent",
            });
        },
    });
    const cancelCollaborationMutation = useMutation({
        mutationFn: async () => {
            if (!userId)
                throw new Error("Not authenticated");
            console.log('Cancelling collaboration request:', { userId, musicianId });
            const { data, error } = await supabase
                .from('collaborators')
                .delete()
                .eq('requester_id', userId)
                .eq('musician_id', musicianId)
                .select();
            console.log('Delete response:', { data, error });
            if (error)
                throw error;
        },
        onSuccess: () => {
            console.log('Successfully cancelled collaboration request');
            queryClient.invalidateQueries({ queryKey: ['collaboration-status', musicianId, userId] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
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
    if (!collaborationStatus) {
        return (_jsxs(Button, { variant: "outline", onClick: () => collaborateMutation.mutate(), disabled: collaborateMutation.isPending || isRequesting, size: "sm", className: "w-[120px] flex items-center gap-1 text-xs", children: [_jsx(HandshakeIcon, { className: "h-3 w-3" }), _jsx("span", { children: "Request Collab" })] }));
    }
    if (collaborationStatus === 'pending') {
        return (_jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", disabled: true, size: "sm", className: "w-[120px] flex items-center gap-1 text-xs", children: [_jsx(HandshakeIcon, { className: "h-3 w-3" }), _jsx("span", { children: "Request Pending" })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => cancelCollaborationMutation.mutate(), disabled: cancelCollaborationMutation.isPending, className: "h-8 w-8 p-0", children: _jsx(X, { className: "h-4 w-4 text-red-500" }) })] }));
    }
    if (collaborationStatus === 'accepted') {
        return (_jsxs(Button, { variant: "outline", disabled: true, size: "sm", className: "w-[120px] flex items-center gap-1 text-xs", children: [_jsx(HandshakeIcon, { className: "h-3 w-3" }), _jsx("span", { children: "Collaborator" })] }));
    }
    return null;
};
