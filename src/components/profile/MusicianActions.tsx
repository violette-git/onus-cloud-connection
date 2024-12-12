import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FollowButton } from "./musician-actions/FollowButton";
import { CollaborationButton } from "./musician-actions/CollaborationButton";
import { MessageDialog } from "./musician-actions/MessageDialog";

interface MusicianActionsProps {
  musicianUserId: string | null;
  musicianId: string;
}

export const MusicianActions = ({ musicianUserId, musicianId }: MusicianActionsProps) => {
  const { user } = useAuth();

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

  const { data: userProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: collaborationStatus } = useQuery({
    queryKey: ['collaboration-status', musicianId, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // First check if the current user has sent a request to this musician
      const { data: requestorStatus } = await supabase
        .from('collaborators')
        .select('status')
        .eq('requester_id', user.id)
        .eq('musician_id', musicianId)
        .maybeSingle();

      if (requestorStatus) {
        console.log('Found status as requester:', requestorStatus.status);
        return requestorStatus.status;
      }

      // If no request found as requester, check if the current user (as a musician) has received a request
      const { data: currentUserMusician } = await supabase
        .from('musicians')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (currentUserMusician) {
        const { data: musicianStatus } = await supabase
          .from('collaborators')
          .select('status')
          .eq('musician_id', currentUserMusician.id)
          .eq('requester_id', musicianUserId)
          .maybeSingle();

        if (musicianStatus) {
          console.log('Found status as musician:', musicianStatus.status);
          return musicianStatus.status;
        }
      }

      console.log('No collaboration status found');
      return null;
    },
    enabled: !!user && !!musicianId && userProfile?.role === 'musician',
  });

  return (
    <div className="flex flex-col items-center gap-2 mt-2">
      <FollowButton
        userId={user.id}
        musicianUserId={musicianUserId || ''}
        isFollowing={!!isFollowing}
      />

      {userProfile?.role === 'musician' && (
        <CollaborationButton
          userId={user.id}
          musicianId={musicianId}
          collaborationStatus={collaborationStatus}
        />
      )}

      <MessageDialog recipientId={musicianUserId || ''} />
    </div>
  );
};