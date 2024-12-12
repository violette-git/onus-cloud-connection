import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ConnectionsProps {
  userId: string;
}

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface Following {
  followed: Profile;
}

interface Collaborator {
  musician: {
    id: string;
    name: string;
    user_id: string;
    profile: Profile;
  };
}

export const Connections = ({ userId }: ConnectionsProps) => {
  const navigate = useNavigate();
  const [followingSearch, setFollowingSearch] = useState("");
  const [collaboratorsSearch, setCollaboratorsSearch] = useState("");

  const { data: following } = useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('followers')
        .select(`
          followed:profiles!followers_followed_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('follower_id', userId);
      
      if (error) throw error;
      return data as Following[];
    },
    enabled: !!userId,
  });

  const { data: collaborators } = useQuery({
    queryKey: ['collaborators', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collaborators')
        .select(`
          musician:musicians!collaborators_musician_id_fkey (
            id,
            name,
            user_id,
            profile:profiles!musicians_user_id_fkey (
              id,
              username,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('requester_id', userId)
        .eq('status', 'accepted');
      
      if (error) throw error;
      return (data as any[]).map(item => ({
        musician: {
          ...item.musician,
          profile: item.musician.profile[0] // Convert array to single object
        }
      })) as Collaborator[];
    },
    enabled: !!userId,
  });

  const filteredFollowing = following?.filter(follow => {
    const searchTerm = followingSearch.toLowerCase();
    const fullName = follow.followed.full_name?.toLowerCase() || '';
    const username = follow.followed.username?.toLowerCase() || '';
    return fullName.includes(searchTerm) || username.includes(searchTerm);
  });

  const filteredCollaborators = collaborators?.filter(collab => {
    const searchTerm = collaboratorsSearch.toLowerCase();
    const fullName = collab.musician.profile?.full_name?.toLowerCase() || '';
    const username = collab.musician.profile?.username?.toLowerCase() || '';
    const name = collab.musician.name.toLowerCase();
    return fullName.includes(searchTerm) || username.includes(searchTerm) || name.includes(searchTerm);
  });

  return (
    <Tabs defaultValue="following" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="following">Following</TabsTrigger>
        <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
      </TabsList>
      
      <TabsContent value="following">
        <div className="space-y-4">
          <Input
            placeholder="Search following..."
            value={followingSearch}
            onChange={(e) => setFollowingSearch(e.target.value)}
            className="mb-4"
          />
          {filteredFollowing?.map((follow) => (
            <div key={follow.followed.id} className="flex items-center justify-between p-4 bg-card rounded-lg animate-fade-in">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={follow.followed.avatar_url || undefined} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span>{follow.followed.full_name || follow.followed.username}</span>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate(`/profile/${follow.followed.id}`)}
              >
                View Profile
              </Button>
            </div>
          ))}
          {!filteredFollowing?.length && (
            <p className="text-center text-muted-foreground">
              {followingSearch ? "No matching results" : "Not following anyone yet"}
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="collaborators">
        <div className="space-y-4">
          <Input
            placeholder="Search collaborators..."
            value={collaboratorsSearch}
            onChange={(e) => setCollaboratorsSearch(e.target.value)}
            className="mb-4"
          />
          {filteredCollaborators?.map((collab) => (
            <div key={collab.musician.id} className="flex items-center justify-between p-4 bg-card rounded-lg animate-fade-in">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={collab.musician.profile?.avatar_url || undefined} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span>
                  {collab.musician.profile?.full_name || 
                   collab.musician.profile?.username || 
                   collab.musician.name}
                </span>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate(`/musicians/${collab.musician.id}`)}
              >
                View Profile
              </Button>
            </div>
          ))}
          {!filteredCollaborators?.length && (
            <p className="text-center text-muted-foreground">
              {collaboratorsSearch ? "No matching results" : "No collaborators yet"}
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};