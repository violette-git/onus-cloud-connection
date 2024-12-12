import { Button } from "@/components/ui/button";
import { UserPlus2, UserMinus2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FollowButtonProps {
  userId: string;
  musicianUserId: string;
  isFollowing: boolean;
}

export const FollowButton = ({ userId, musicianUserId, isFollowing }: FollowButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !musicianUserId) throw new Error("Not authenticated");
      if (isFollowing) {
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('follower_id', userId)
          .eq('followed_id', musicianUserId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('followers')
          .insert({ follower_id: userId, followed_id: musicianUserId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following', musicianUserId, userId] });
      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing ? "You've unfollowed this musician" : "You're now following this musician",
      });
    },
  });

  return (
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
  );
};