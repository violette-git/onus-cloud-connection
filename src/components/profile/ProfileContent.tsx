import { Music2, Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CreateMusicianForm } from "./CreateMusicianForm";
import { SongManager } from "./SongManager";
import { VideoManager } from "./VideoManager";
import { Button } from "@/components/ui/button";
import type { Musician } from "@/types/profile";

interface ProfileContentProps {
  musician: Musician | null;
  onProfileCreated?: () => void;
}

export const ProfileContent = ({ musician, onProfileCreated }: ProfileContentProps) => {
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

  return (
    <div className="mt-12 space-y-8 max-w-4xl mx-auto px-4">
      {musician.bio && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Bio</h2>
          <p className="text-muted-foreground">{musician.bio}</p>
        </div>
      )}
      
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Songs</h2>
            {isOwner && (
              <Button>
                <Music2 className="mr-2 h-4 w-4" />
                Add Song
              </Button>
            )}
          </div>
          {isOwner && (
            <SongManager 
              musicianId={musician.id} 
              songs={musician.songs || []}
            />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Videos</h2>
            {isOwner && (
              <Button>
                <Video className="mr-2 h-4 w-4" />
                Add Video
              </Button>
            )}
          </div>
          {isOwner && (
            <VideoManager 
              musicianId={musician.id} 
              videos={musician.videos || []}
            />
          )}
        </div>

        {(!musician.songs?.length && !musician.videos?.length) && (
          <div className="text-center py-12">
            <div className="flex justify-center space-x-4">
              <Music2 className="h-12 w-12 text-muted-foreground" />
              <Video className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mt-4">No content added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};