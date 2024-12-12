import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { VideoEmbed } from "@/components/profile/VideoEmbed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MusicianActions } from "@/components/profile/MusicianActions";
import { CollaborationRequests } from "@/components/profile/CollaborationRequests";
import type { Musician } from "@/types/profile";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const MusicianProfile = () => {
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
  const displayName = isOwner 
    ? musician.profile?.username || musician.profile?.full_name || "Anonymous User"
    : musician.name;

  return (
    <div className="min-h-screen">
      <div className="h-64 bg-gradient-to-r from-onus-purple/20 via-onus-blue/20 to-onus-pink/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center relative -bottom-32">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage
                src={musician.profile?.avatar_url || undefined}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback>
                <User className="h-12 w-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold mt-4">{displayName}</h1>
            <p className="text-muted-foreground">Musician</p>
            
            {!isOwner && (
              <div className="mt-4">
                <MusicianActions 
                  musicianUserId={musician.user_id} 
                  musicianId={musician.id}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-40">
        {isOwner && (
          <>
            <div className="flex justify-end mb-8">
              <Button variant="outline">Edit Links</Button>
            </div>
            <CollaborationRequests musicianId={musician.id} />
          </>
        )}

        <div className="space-y-8">
          {musician.bio && (
            <div className="max-w-2xl mx-auto">
              <p className="text-muted-foreground text-center">{musician.bio}</p>
            </div>
          )}

          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Songs</h2>
                {isOwner && (
                  <Button>Add Song</Button>
                )}
              </div>
              {musician.songs && musician.songs.length > 0 ? (
                <div className="space-y-4">
                  {musician.songs.map((song) => (
                    <div key={song.id} className="p-4 bg-card rounded-lg">
                      <h3 className="font-medium mb-2">{song.title}</h3>
                      <audio controls className="w-full">
                        <source src={song.url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No songs added yet</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Videos</h2>
                {isOwner && (
                  <Button>Add Video</Button>
                )}
              </div>
              {musician.videos && musician.videos.length > 0 ? (
                <div className="space-y-4">
                  {musician.videos.map((video) => (
                    <div key={video.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{video.title}</h3>
                        {isOwner && (
                          <Button variant="ghost" className="text-destructive">
                            Delete
                          </Button>
                        )}
                      </div>
                      <VideoEmbed video={video} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No videos added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
