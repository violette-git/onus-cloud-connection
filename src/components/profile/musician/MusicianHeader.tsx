import { MusicianActions } from "@/components/profile/MusicianActions";
import { User } from "lucide-react";
import type { Musician } from "@/types/musician";

interface MusicianHeaderProps {
  musician: Musician;
}

export const MusicianHeader = ({ musician }: MusicianHeaderProps) => {
  return (
    <div className="relative">
      <div className="h-48 md:h-64 bg-gradient-to-r from-onus-purple/20 via-onus-blue/20 to-onus-pink/20" />
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-24">
        <div className="flex flex-col items-center space-y-4">
          <div className="gradient-border relative">
            {musician.profile?.avatar_url ? (
              <img
                src={musician.profile.avatar_url}
                alt={musician.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover bg-background"
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-muted flex items-center justify-center">
                <User className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">{musician.name}</h1>
            <p className="text-muted-foreground mt-1">
              {musician.location && (
                <span className="text-sm md:text-base">{musician.location}</span>
              )}
            </p>
          </div>
          <div className="w-full max-w-sm">
            <MusicianActions 
              musicianUserId={musician.user_id} 
              musicianId={musician.id} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};