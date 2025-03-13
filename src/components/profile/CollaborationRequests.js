import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
export const CollaborationRequests = ({ musicianId }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { data: requests, isLoading } = useQuery({
        queryKey: ['collaboration-requests', musicianId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('collaborators')
                .select(`
          requester_id,
          musician_id,
          status,
          created_at,
          updated_at,
          requester:profiles!collaborators_requester_id_fkey (
            username,
            full_name,
            avatar_url
          )
        `)
                .eq('musician_id', musicianId)
                .eq('status', 'pending');
            if (error)
                throw error;
            return data;
        },
        enabled: !!musicianId,
    });
    const updateRequestMutation = useMutation({
        mutationFn: async ({ requesterId, status }) => {
            const { error } = await supabase
                .from('collaborators')
                .update({ status })
                .eq('requester_id', requesterId)
                .eq('musician_id', musicianId);
            if (error)
                throw error;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['collaboration-requests', musicianId] });
            queryClient.invalidateQueries({ queryKey: ['collaboration', musicianId] });
            toast({
                title: variables.status === 'accepted' ? "Request Accepted" : "Request Rejected",
                description: variables.status === 'accepted'
                    ? "You've accepted the collaboration request"
                    : "You've rejected the collaboration request",
            });
        },
    });
    if (isLoading)
        return null;
    if (!requests?.length)
        return null;
    return (_jsxs("div", { className: "space-y-4 mt-4", children: [_jsx("h3", { className: "text-sm font-medium", children: "Collaboration Requests" }), _jsx("div", { className: "space-y-2", children: requests.map((request) => (_jsxs("div", { className: "flex items-center justify-between p-2 bg-secondary rounded-lg", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { className: "text-sm", children: request.requester.full_name || request.requester.username }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { size: "sm", variant: "ghost", className: "h-8 w-8 p-0", onClick: () => updateRequestMutation.mutate({
                                        requesterId: request.requester_id,
                                        status: 'accepted'
                                    }), children: _jsx(Check, { className: "h-4 w-4 text-green-500" }) }), _jsx(Button, { size: "sm", variant: "ghost", className: "h-8 w-8 p-0", onClick: () => updateRequestMutation.mutate({
                                        requesterId: request.requester_id,
                                        status: 'rejected'
                                    }), children: _jsx(X, { className: "h-4 w-4 text-red-500" }) })] })] }, request.requester_id))) })] }));
};
