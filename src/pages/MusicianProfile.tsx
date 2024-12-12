import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoEmbed } from "@/components/profile/VideoEmbed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MusicianActions } from "@/components/profile/MusicianActions";
import type { Musician } from "@/types/profile";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const MusicianProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: musician, isLoading } = useQuery({
    queryKey: ['musician', id],
    queryFn: async () => {
      const { data: musicianData, error: musicianError } = await supabase
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
        .single();

      if (musicianError) throw musicianError;

      if (musicianData?.user_id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('avatar_url, username, full_name')
          .eq('id', musicianData.user_id)
          .single();

        if (profileError) throw profileError;

        return {
          ...musicianData,
          profile: profileData
        } as Musician;
      }

      return musicianData as Musician;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">Loading musician profile...</p>
        </div>
      </div>
    );
  }

  if (!musician) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">Musician not found</p>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === musician.user_id;
  
  // For the profile owner, prioritize their profile information
  const displayName = isOwner 
    ? musician.profile?.username || musician.profile?.full_name || musician.name
    : musician.name;

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 relative">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={musician.profile?.avatar_url || undefined}
                        alt={displayName}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        <User className="h-12 w-12 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle>{displayName}</CardTitle>
                  {!isOwner && (
                    <MusicianActions 
                      musicianUserId={musician.user_id} 
                      musicianId={musician.id} 
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {musician.bio && (
                  <p className="mt-4 text-muted-foreground text-center">{musician.bio}</p>
                )}
                {musician.location && (
                  <p className="mt-2 text-sm text-muted-foreground text-center">
                    📍 {musician.location}
                  </p>
                )}
                {musician.musician_genres && musician.musician_genres.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2 text-center">Genres</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {musician.musician_genres.map((mg) => (
                        <span
                          key={mg.genre.name}
                          className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                        >
                          {mg.genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {musician.songs && musician.songs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Songs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {musician.songs.map((song) => (
                      <div key={song.id} className="space-y-2">
                        <h3 className="font-medium">{song.title}</h3>
                        <audio
                          controls
                          className="w-full"
                          src={song.url}
                        >
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {musician.videos && musician.videos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {musician.videos.map((video) => (
                      <div key={video.id} className="space-y-2">
                        <h3 className="font-medium">{video.title}</h3>
                        <VideoEmbed video={video} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicianProfile;