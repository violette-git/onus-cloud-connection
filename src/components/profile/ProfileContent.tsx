import { Music2, Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CreateMusicianForm } from "./CreateMusicianForm";
import { SongManager } from "./SongManager";
import { VideoManager } from "./VideoManager";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Connections } from "@/components/profile/Connections";
import { FeaturedContent } from "./FeaturedContent";
import type { Musician, Profile } from "@/types/profile";

interface ProfileContentProps {
  musician: Musician | null;
  onProfileCreated?: () => void;
  profile: Profile;
  isOwner: boolean;
}

export const ProfileContent = ({ musician, onProfileCreated, profile, isOwner }: ProfileContentProps) => {
  const { user } = useAuth();

  if (!musician && user && isOwner) {
    return (
      <div className="max-w-xl mx-auto mt-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Create Your Musician Profile</h2>
          <p className="text-muted-foreground">
            Set up your musician profile to start sharing your music and connecting with fans
          </p>
        </div>
        <CreateMusicianForm 
          userId={user.id} 
          onSuccess={() => onProfileCreated?.()}
        />
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {musician && (
        <div className="mb-8">
          <FeaturedContent
            musicianId={musician.id}
            isOwner={isOwner}
            songs={musician.songs || []}
            videos={musician.videos || []}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {musician && (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Music2 className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">My Songs</h2>
                  </div>
                  <ScrollArea className="h-[400px]">
                    <div className="pr-4">
                      <SongManager 
                        musicianId={musician.id} 
                        songs={musician.songs || []}
                      />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Video className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">My Videos</h2>
                  </div>
                  <ScrollArea className="h-[400px]">
                    <div className="pr-4">
                      <VideoManager 
                        musicianId={musician.id} 
                        videos={musician.videos || []}
                      />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">About</h3>
              {musician?.bio ? (
                <p className="text-muted-foreground">{musician.bio}</p>
              ) : (
                <p className="text-muted-foreground italic">No bio available</p>
              )}
              {musician?.musician_genres && musician.musician_genres.length > 0 && (
                <>
                  <div className="my-4 border-t" />
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
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">My Network</h3>
              <ScrollArea className="h-[300px]">
                <Connections userId={profile.id} />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {musician && (!musician.songs?.length && !musician.videos?.length) && (
        <div className="text-center py-12">
          <div className="flex justify-center space-x-4">
            <Music2 className="h-12 w-12 text-muted-foreground" />
            <Video className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mt-4">No content added yet</p>
        </div>
      )}
    </div>
  );
};