import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Profile } from "@/types/profile";

interface CollaboratorsListProps {
  userId: string;
}

interface Collaborator {
  musician: {
    id: string;
    name: string;
    user_id: string;
    profile: Profile;
  };
}

export const CollaboratorsList = ({ userId }: CollaboratorsListProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: collaborators } = useQuery({
    queryKey: ['collaborators', userId],
    queryFn: async () => {
      console.log('Fetching collaborators data for userId:', userId);
      
      // First, get collaborations where user is the requester
      const { data: requesterCollabs, error: requesterError } = await supabase
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

      if (requesterError) {
        console.error('Error fetching requester collaborations:', requesterError);
        throw requesterError;
      }

      // Then, get collaborations where user is the musician
      const { data: musicianCollabs, error: musicianError } = await supabase
        .from('musicians')
        .select(`
          id,
          name,
          user_id,
          profile:profiles!musicians_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          ),
          collaborations:collaborators!collaborators_musician_id_fkey (
            requester:profiles!collaborators_requester_id_fkey (
              id,
              username,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('user_id', userId)
        .eq('collaborations.status', 'accepted');

      if (musicianError) {
        console.error('Error fetching musician collaborations:', musicianError);
        throw musicianError;
      }

      // Combine and format both sets of collaborations
      const allCollaborations = [
        ...(requesterCollabs || []),
        ...(musicianCollabs || []).map(musician => ({
          musician: {
            id: musician.id,
            name: musician.name,
            user_id: musician.user_id,
            profile: musician.profile
          }
        }))
      ];

      console.log('All collaborations:', allCollaborations);
      return allCollaborations as Collaborator[];
    },
    enabled: !!userId,
  });

  const filteredCollaborators = collaborators?.filter(collab => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    const fullName = (collab.musician.profile?.full_name || '').toLowerCase();
    const username = (collab.musician.profile?.username || '').toLowerCase();
    const name = collab.musician.name.toLowerCase();
    
    return fullName.includes(searchLower) || 
           username.includes(searchLower) || 
           name.includes(searchLower);
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search collaborators..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 bg-background"
      />
      {filteredCollaborators?.map((collab) => (
        <div key={collab.musician.id} className="flex items-center justify-between p-4 bg-card/50 rounded-lg animate-fade-in">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-1 ring-border">
              <AvatarImage 
                src={collab.musician.profile?.avatar_url || undefined}
                alt={collab.musician.profile?.username || 'User avatar'}
                className="object-cover w-full h-full"
              />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">
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
          {searchTerm ? "No matching results" : "No collaborators yet"}
        </p>
      )}
    </div>
  );
};