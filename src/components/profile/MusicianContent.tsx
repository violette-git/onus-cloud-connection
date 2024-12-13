import { Music2, Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CreateMusicianForm } from "./CreateMusicianForm";
import { SongManager } from "./SongManager";
import { VideoManager } from "./VideoManager";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Connections } from "./Connections";
import type { Musician } from "@/types/profile";

interface MusicianContentProps {
  musician: Musician | null;
  onProfileCreated?: () => void;
}

export const MusicianContent = ({ musician, onProfileCreated }: MusicianContentProps) => {
  const { user } = useAuth();

  if (!musician && user) {
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

  if (!musician) return null;

  const isOwner = user?.id === musician.user_id;
  const hasSongs = musician.songs && musician.songs.length > 0;
  const hasVideos = musician.videos && musician.videos.length > 0;
  const hasContent = hasSongs || hasVideos;

  return (
    <div className="mt-12 space-y-8">
      {musician.bio && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Bio</h2>
            <p className="text-muted-foreground">{musician.bio}</p>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Songs Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Music2 className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">My Songs</h2>
            </div>
            <ScrollArea className="h-[400px]">
              <div className="pr-4">
                {isOwner && (
                  <SongManager 
                    musicianId={musician.id} 
                    songs={musician.songs || []}
                  />
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Videos Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Video className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">My Videos</h2>
            </div>
            <ScrollArea className="h-[400px]">
              <div className="pr-4">
                {isOwner && (
                  <VideoManager 
                    musicianId={musician.id} 
                    videos={musician.videos || []}
                  />
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {!hasContent && (
        <div className="text-center py-12">
          <div className="flex justify-center space-x-4">
            <Music2 className="h-12 w-12 text-muted-foreground" />
            <Video className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mt-4">No content added yet</p>
        </div>
      )}

      {isOwner && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">My Network</h3>
            <ScrollArea className="h-[300px]">
              <Connections userId={user.id} />
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};