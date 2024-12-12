import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CollaboratorCard } from "./collaborators/CollaboratorCard";
import { SearchCollaborators } from "./collaborators/SearchCollaborators";
import { useState } from "react";
import type { Profile } from "@/types/profile";

interface CollaboratorsListProps {
  userId: string;
}

interface Collaborator {
  musician_id: string;
  requester_id: string;
  musician: {
    id: string;
    name: string;
    user_id: string;
    profile: Profile;
  };
  requester: Profile;
}

export const CollaboratorsList = ({ userId }: CollaboratorsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: collaborations } = useQuery({
    queryKey: ['collaborators', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collaborators')
        .select(`
          musician_id,
          requester_id,
          musician:musicians!collaborators_musician_id_fkey (
            id,
            name,
            user_id,
            profile:profiles!musicians_user_id_fkey (*)
          ),
          requester:profiles!collaborators_requester_id_fkey (*)
        `)
        .eq('status', 'accepted')
        .or(`requester_id.eq.${userId},musician:musicians!collaborators_musician_id_fkey(user_id).eq.${userId}`);

      if (error) {
        console.error('Error fetching collaborations:', error);
        throw error;
      }

      return data as Collaborator[];
    },
    enabled: !!userId,
  });

  const filteredCollaborators = collaborations?.map(collab => {
    // If the current user is the requester, show the musician
    // If the current user is the musician, show the requester
    const isRequester = collab.requester_id === userId;
    
    if (isRequester) {
      return {
        id: collab.musician.id,
        name: collab.musician.name,
        profile: collab.musician.profile
      };
    } else {
      return {
        id: collab.musician.id, // Still use musician ID for navigation
        name: collab.requester.username || '',
        profile: collab.requester
      };
    }
  }).filter(collab => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    const fullName = (collab.profile?.full_name || '').toLowerCase();
    const username = (collab.profile?.username || '').toLowerCase();
    const name = collab.name.toLowerCase();
    
    return fullName.includes(searchLower) || 
           username.includes(searchLower) || 
           name.includes(searchLower);
  });

  return (
    <div className="space-y-4">
      <SearchCollaborators 
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
      />
      
      {filteredCollaborators?.map((collab) => (
        <CollaboratorCard
          key={`${collab.id}-${collab.profile?.id}`}
          id={collab.id}
          name={collab.name}
          profile={collab.profile}
        />
      ))}
      
      {!filteredCollaborators?.length && (
        <p className="text-center text-muted-foreground">
          {searchTerm ? "No matching results" : "No collaborators yet"}
        </p>
      )}
    </div>
  );
};