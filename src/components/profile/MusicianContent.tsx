import { Music2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CreateMusicianForm } from "./CreateMusicianForm";
import { SongManager } from "./SongManager";
import type { Musician } from "@/types/profile";

interface MusicianContentProps {
  musician: Musician | null;
  onProfileCreated?: () => void;
}

export const MusicianContent = ({ musician, onProfileCreated }: MusicianContentProps) => {
  const { user } = useAuth();

  return (
    <div className="mt-12 px-8">
      {musician ? (
        <div className="space-y-8">
          {musician.bio && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold mb-2">Bio</h2>
              <p className="text-muted-foreground">{musician.bio}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6">
            {user?.id === musician.user_id && (
              <SongManager 
                musicianId={musician.id} 
                songs={musician.songs || []}
              />
            )}

            {(!musician.songs || musician.songs.length === 0) && (
              <div className="col-span-full text-center py-12">
                <Music2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No songs added yet</p>
              </div>
            )}
          </div>
        </div>
      ) : user && (
        <div className="max-w-xl mx-auto">
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
      )}
    </div>
  );
};