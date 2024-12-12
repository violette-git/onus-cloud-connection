import type { Musician } from "@/types/profile";

interface MusicianBioProps {
  musician: Musician;
}

export const MusicianBio = ({ musician }: MusicianBioProps) => {
  if (!musician.bio) return null;
  
  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-muted-foreground text-center">{musician.bio}</p>
    </div>
  );
};