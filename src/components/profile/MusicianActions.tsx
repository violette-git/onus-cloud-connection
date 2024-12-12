import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus2, UserMinus2, HandshakeIcon, X } from "lucide-react";
import { useCancelCollaboration } from "@/hooks/useCancelCollaboration";

interface MusicianActionsProps {
  musicianUserId: string | null;
  musicianId: string;
}

export const MusicianActions = ({ musicianUserId, musicianId }: MusicianActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRequesting, setIsRequesting] = useState(false);
  const { mutate: cancelCollaboration, isPending: isCancelling } = useCancelCollaboration();

  // If this is the current user's profile, or no user is logged in, don't show any actions
  if (!user || user.id === musicianUserId) return null;

  const { data: isFollowing } = useQuery({
    queryKey: ['following', musicianUserId, user?.id],
    queryFn: async () => {
      if (!user?.id || !musicianUserId) return false;
      const { data } = await supabase
        .from('followers')
        .select('*')
        .eq('follower_id', user.id)
        .eq('followed_id', musicianUserId)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user && !!musicianUserId,
  });

  const { data: collaborationStatus } = useQuery({
    queryKey: ['collaboration', musicianId, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('collaborators')
        .select('status')
        .eq('requester_id', user.id)
        .eq('musician_id', musicianId)
        .maybeSingle();
      return data?.status;
    },
    enabled: !!user && !!musicianId,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !musicianUserId) throw new Error("Not authenticated");
      if (isFollowing) {
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('follower_id', user.id)
          .eq('followed_id', musicianUserId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('followers')
          .insert({ follower_id: user.id, followed_id: musicianUserId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following', musicianUserId, user?.id] });
      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing ? "You've unfollowed this musician" : "You're now following this musician",
      });
    },
  });

  const collaborateMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");
      const { error } = await supabase
        .from('collaborators')
        .insert({ requester_id: user.id, musician_id: musicianId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaboration', musicianId, user?.id] });
      toast({
        title: "Request Sent",
        description: "Your collaboration request has been sent",
      });
    },
  });

  const handleCancelRequest = () => {
    if (!user?.id) return;
    cancelCollaboration(
      { requesterId: user.id, musicianId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['collaboration', musicianId, user?.id] });
        }
      }
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-2">
      <Button
        variant={isFollowing ? "outline" : "default"}
        onClick={() => followMutation.mutate()}
        disabled={followMutation.isPending}
        size="sm"
        className="w-full max-w-[120px] flex items-center gap-1 text-xs"
      >
        {isFollowing ? (
          <>
            <UserMinus2 className="h-3 w-3" />
            <span>Unfollow</span>
          </>
        ) : (
          <>
            <UserPlus2 className="h-3 w-3" />
            <span>Follow</span>
          </>
        )}
      </Button>

      {!collaborationStatus && (
        <Button
          variant="outline"
          onClick={() => collaborateMutation.mutate()}
          disabled={collaborateMutation.isPending || isRequesting}
          size="sm"
          className="w-full max-w-[120px] flex items-center gap-1 text-xs"
        >
          <HandshakeIcon className="h-3 w-3" />
          <span>Request Collab</span>
        </Button>
      )}

      {collaborationStatus === 'pending' && (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            disabled 
            size="sm"
            className="w-full max-w-[120px] flex items-center gap-1 text-xs"
          >
            <HandshakeIcon className="h-3 w-3" />
            <span>Request Pending</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelRequest}
            disabled={isCancelling}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )}

      {collaborationStatus === 'accepted' && (
        <Button 
          variant="outline" 
          disabled 
          size="sm"
          className="w-full max-w-[120px] flex items-center gap-1 text-xs"
        >
          <HandshakeIcon className="h-3 w-3" />
          <span>Collaborator</span>
        </Button>
      )}
    </div>
  );
};