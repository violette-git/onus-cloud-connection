import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowingList } from "./FollowingList";
import { FollowersList } from "./FollowersList";
import { CollaboratorsList } from "./CollaboratorsList";
import { CollaborationRequests } from "./CollaborationRequests";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ConnectionsProps {
  userId: string;
}

export const Connections = ({ userId }: ConnectionsProps) => {
  const { user } = useAuth();

  // Check if the user is a musician to show collaboration requests
  const { data: userProfile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      return data;
    },
    enabled: !!userId,
  });

  // Get musician ID if the user is a musician
  const { data: musician } = useQuery({
    queryKey: ['musician', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('musicians')
        .select('id')
        .eq('user_id', userId)
        .single();
      return data;
    },
    enabled: !!userId && userProfile?.role === 'musician',
  });

  return (
    <Tabs defaultValue="following" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="following">Following</TabsTrigger>
        <TabsTrigger value="followers">Followers</TabsTrigger>
        <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
      </TabsList>
      
      <TabsContent value="following">
        <FollowingList userId={userId} />
      </TabsContent>

      <TabsContent value="followers">
        <FollowersList userId={userId} />
      </TabsContent>

      <TabsContent value="collaborators">
        <div className="space-y-6">
          {userProfile?.role === 'musician' && musician?.id && (
            <CollaborationRequests musicianId={musician.id} />
          )}
          <CollaboratorsList userId={userId} />
        </div>
      </TabsContent>
    </Tabs>
  );
};