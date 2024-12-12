import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { VideoEmbed } from "@/components/profile/VideoEmbed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MusicianActions } from "@/components/profile/MusicianActions";
import { CollaborationRequests } from "@/components/profile/CollaborationRequests";
import { Connections } from "@/components/profile/Connections";
import { MusicianHeader } from "@/components/profile/musician/MusicianHeader";
import { MusicianBio } from "@/components/profile/musician/MusicianBio";
import { MusicianContent } from "@/components/profile/musician/MusicianContent";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
      <MusicianHeader musician={musician} />
      
      <div className="container mx-auto px-4 mt-40">
        {isOwner && (
          <CollaborationRequests musicianId={musician.id} />
        )}

        <div className="space-y-8">
          <MusicianBio musician={musician} />

          {isOwner && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">My Connections</h2>
              <Connections userId={user?.id || ''} />
            </div>
          )}

          <MusicianContent musician={musician} isOwner={isOwner} />
        </div>
      </div>
    </div>
  );
};