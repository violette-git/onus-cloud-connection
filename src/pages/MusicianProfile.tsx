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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Video, Users2 } from "lucide-react";

export const MusicianProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: musician, isLoading } = useQuery({
    queryKey: ['musician', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
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
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading musician profile...</p>
        </div>
      </div>
    );
  }

  if (!musician) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Musician not found</p>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === musician.user_id;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient Background */}
      <div className="h-[280px] bg-gradient-to-br from-onus-purple/20 via-onus-blue/20 to-onus-pink/20">
        <div className="container mx-auto px-4 pt-8">
          <BackButton />
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Profile Header Section */}
        <div className="-mt-24 mb-12">
          <MusicianHeader musician={musician} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <MusicianBio musician={musician} />
                  {musician.musician_genres && musician.musician_genres.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="font-semibold mb-3">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                          {musician.musician_genres.map((mg, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-secondary rounded-full text-sm"
                            >
                              {mg.genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {isOwner && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Users2 className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold">My Network</h3>
                    </div>
                    <ScrollArea className="h-[300px]">
                      <Connections userId={user?.id || ''} />
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {isOwner && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <CollaborationRequests musicianId={musician.id} />
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 gap-8">
              {/* Songs Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Music className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Songs</h2>
                  </div>
                  <ScrollArea className="h-[400px]">
                    <div className="pr-4">
                      <MusicianMedia musician={musician} isOwner={isOwner} />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Videos Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Video className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Videos</h2>
                  </div>
                  <ScrollArea className="h-[400px]">
                    <div className="pr-4">
                      <MusicianMedia musician={musician} isOwner={isOwner} />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};