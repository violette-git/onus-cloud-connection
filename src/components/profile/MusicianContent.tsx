import { Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Musician } from "@/types/profile";

interface MusicianContentProps {
  musician: Musician | null;
}

export const MusicianContent = ({ musician }: MusicianContentProps) => {
  return (
    <div className="mt-12 px-8">
      {musician ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Complete Your Musician Profile</h2>
          <p className="text-muted-foreground mb-4">
            Set up your musician profile to start sharing your music
          </p>
          <Button>
            Create Musician Profile
          </Button>
        </div>
      )}
    </div>
  );
};