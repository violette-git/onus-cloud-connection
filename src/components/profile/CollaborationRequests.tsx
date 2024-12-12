import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";

interface CollaborationRequestsProps {
  musicianId: string;
}

interface Requester {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface CollaborationRequest {
  requester_id: string;
  musician_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  requester: Requester;
}

export const CollaborationRequests = ({ musicianId }: CollaborationRequestsProps) => {
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
      
      if (error) throw error;
      return data as CollaborationRequest[];
    },
    enabled: !!musicianId,
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ requesterId, status }: { requesterId: string, status: 'accepted' | 'rejected' }) => {
      const { error } = await supabase
        .from('collaborators')
        .update({ status })
        .eq('requester_id', requesterId)
        .eq('musician_id', musicianId);
      
      if (error) throw error;
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

  if (isLoading) return null;
  if (!requests?.length) return null;

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-sm font-medium">Collaboration Requests</h3>
      <div className="space-y-2">
        {requests.map((request) => (
          <div key={request.requester_id} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm">{request.requester.full_name || request.requester.username}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => updateRequestMutation.mutate({ 
                  requesterId: request.requester_id,
                  status: 'accepted'
                })}
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => updateRequestMutation.mutate({ 
                  requesterId: request.requester_id,
                  status: 'rejected'
                })}
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};