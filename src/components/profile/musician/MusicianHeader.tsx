import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MusicianActions } from "@/components/profile/MusicianActions";
import { User } from "lucide-react";
import type { Musician } from "@/types/profile";
import { useAuth } from "@/contexts/AuthContext";

interface MusicianHeaderProps {
  musician: Musician;
}

export const MusicianHeader = ({ musician }: MusicianHeaderProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === musician.user_id;
  
  // Get the most appropriate avatar URL from the profile
  const avatarUrl = musician.profile?.avatar_url || musician.avatar_url;

  return (
    <div className="h-64 bg-gradient-to-r from-onus-purple/20 via-onus-blue/20 to-onus-pink/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center relative -bottom-32">
          <Avatar className="w-32 h-32 border-4 border-background">
            <AvatarImage
              src={avatarUrl || ''}
              alt={musician.name}
              className="object-cover"
            />
            <AvatarFallback>
              <User className="h-12 w-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center mt-4">
            <h1 className="text-3xl font-bold">{musician.name}</h1>
            <p className="text-muted-foreground">Musician</p>
            
            {musician.location && (
              <p className="text-sm text-muted-foreground mt-1">
                {musician.location}
              </p>
            )}
          </div>
          
          {!isOwner && (
            <div className="mt-4">
              <MusicianActions 
                musicianUserId={musician.user_id || ''} 
                musicianId={musician.id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};