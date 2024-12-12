import { Music2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CreateMusicianForm } from "./CreateMusicianForm";
import { SunoPlayer } from "./SunoPlayer";
import type { Musician } from "@/types/profile";

interface MusicianContentProps {
  musician: Musician | null;
  onProfileCreated?: () => void;
}

export const MusicianContent = ({ musician, onProfileCreated }: MusicianContentProps) => {
  const { user } = useAuth();

  // Example song URL - you'll need to replace this with actual song URLs from your data
  const exampleSongUrl = "https://suno.com/song/cb5b62d7-7f79-45fc-927a-a30e9296a428";

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example of how to use the SunoPlayer */}
            <div className="col-span-full md:col-span-2 lg:col-span-3">
              <SunoPlayer songUrl={exampleSongUrl} />
            </div>

            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-card p-6 border hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Music2 className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
            ))}
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