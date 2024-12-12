import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CollaborationData {
  requesterId: string;
  musicianId: string;
}

export const useCancelCollaboration = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (collaborationData: CollaborationData) => {
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('requester_id', collaborationData.requesterId)
        .eq('musician_id', collaborationData.musicianId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Collaboration request cancelled",
        description: "Your collaboration request has been cancelled successfully.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel collaboration request. Please try again.",
      });
    },
  });
};