import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MusicianHeader } from "@/components/profile/musician/MusicianHeader";
import { MusicianBio } from "@/components/profile/musician/MusicianBio";
import { MusicianMedia } from "@/components/profile/musician/MusicianMedia";
import { CollaborationRequests } from "@/components/profile/CollaborationRequests";
import { Connections } from "@/components/profile/Connections";
import { useAuth } from "@/contexts/AuthContext";
import { BackButton } from "@/components/ui/back-button";

export const MusicianProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: musician, isLoading } = useQuery({
    queryKey: ['musician', id],
    queryFn: async () => {
      // First try to find musician by user_id
      const { data: musicianByUserId, error: userIdError } = await supabase
        .from('musicians')
        .select(`
          *,
          profile:profiles!musicians_user_id_fkey (
            avatar_url,
            username,
            full_name
          ),
          musician_genres (
            genre: genres (name)
          ),
          songs (
            id,
            title,
            url,
            created_at,
            updated_at
          ),
          videos (
            id,
            title,
            url,
            platform,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', id)
        .maybeSingle();

      if (musicianByUserId) return musicianByUserId;

      // If not found by user_id, try by musician id
      const { data: musicianById, error: musicianError } = await supabase
        .from('musicians')
        .select(`
          *,
          profile:profiles!musicians_user_id_fkey (
            avatar_url,
            username,
            full_name
          ),
          musician_genres (
            genre: genres (name)
          ),
          songs (
            id,
            title,
            url,
            created_at,
            updated_at
          ),
          videos (
            id,
            title,
            url,
            platform,
            created_at,
            updated_at
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (musicianError) throw musicianError;
      return musicianById;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16">
        <p className="text-center text-muted-foreground">Loading musician profile...</p>
      </div>
    );
  }

  if (!musician) {
    return (
      <div className="min-h-screen pt-16">
        <p className="text-center text-muted-foreground">Musician not found</p>
      </div>
    );
  }

  const isOwner = user?.id === musician.user_id;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-16 max-w-7xl">
        <BackButton />
      </div>
      
      <MusicianHeader musician={musician} />
      
      <div className="container mx-auto px-4 mt-40 max-w-7xl">
        {isOwner && (
          <CollaborationRequests musicianId={musician.id} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          <div className="lg:col-span-4 space-y-8">
            <MusicianBio musician={musician} />

            {isOwner && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">My Connections</h2>
                <Connections userId={user?.id || ''} />
              </div>
            )}
          </div>

          <div className="lg:col-span-8">
            <MusicianMedia musician={musician} isOwner={isOwner} />
          </div>
        </div>
      </div>
    </div>
  );
};