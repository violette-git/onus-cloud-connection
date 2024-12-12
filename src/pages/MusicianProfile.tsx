import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { VideoEmbed } from "@/components/profile/VideoEmbed";
import type { Musician } from "@/types/profile";

const MusicianProfile = () => {
  const { id } = useParams();

  const { data: musician, isLoading } = useQuery({
    queryKey: ['musician', id],
    queryFn: async () => {
      const { data, error } = await supabase
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

      if (error) throw error;
      return data as Musician;
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

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{musician.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square relative">
                  {musician.avatar_url ? (
                    <img
                      src={musician.avatar_url}
                      alt={musician.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                      No image available
                    </div>
                  )}
                </div>
                {musician.bio && (
                  <p className="mt-4 text-muted-foreground">{musician.bio}</p>
                )}
                {musician.location && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    📍 {musician.location}
                  </p>
                )}
                {musician.musician_genres && musician.musician_genres.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
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
                        <AspectRatio ratio={16 / 9}>
                          <VideoEmbed video={video} />
                        </AspectRatio>
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