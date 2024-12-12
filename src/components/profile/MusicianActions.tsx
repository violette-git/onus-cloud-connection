import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HandshakeIcon, UserPlus2, UserMinus2 } from "lucide-react";

interface MusicianActionsProps {
  musicianUserId: string | null;
  musicianId: string;
}

export const MusicianActions = ({ musicianUserId, musicianId }: MusicianActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRequesting, setIsRequesting] = useState(false);

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

  if (!user || user.id === musicianUserId) return null;

  return (
    <div className="flex gap-2">
      <Button
        variant={isFollowing ? "outline" : "default"}
        onClick={() => followMutation.mutate()}
        disabled={followMutation.isPending}
      >
        {isFollowing ? (
          <UserMinus2 className="mr-2 h-4 w-4" />
        ) : (
          <UserPlus2 className="mr-2 h-4 w-4" />
        )}
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>

      {!collaborationStatus && (
        <Button
          variant="outline"
          onClick={() => collaborateMutation.mutate()}
          disabled={collaborateMutation.isPending || isRequesting}
        >
          <HandshakeIcon className="mr-2 h-4 w-4" />
          Request Collaboration
        </Button>
      )}

      {collaborationStatus === 'pending' && (
        <Button variant="outline" disabled>
          <HandshakeIcon className="mr-2 h-4 w-4" />
          Request Pending
        </Button>
      )}

      {collaborationStatus === 'accepted' && (
        <Button variant="outline" disabled>
          <HandshakeIcon className="mr-2 h-4 w-4" />
          Collaborator
        </Button>
      )}
    </div>
  );
};