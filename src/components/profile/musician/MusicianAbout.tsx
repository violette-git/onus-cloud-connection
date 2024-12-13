import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Musician } from "@/types/musician";

interface MusicianAboutProps {
  musician: Musician;
}

export const MusicianAbout = ({ musician }: MusicianAboutProps) => {
  return (
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
  );
};