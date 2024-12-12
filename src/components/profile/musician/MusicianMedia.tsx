import { Button } from "@/components/ui/button";
import { Music2, Video } from "lucide-react";
import { SongManager } from "../SongManager";
import { VideoManager } from "../VideoManager";
import type { Musician } from "@/types/profile";

interface MusicianMediaProps {
  musician: Musician;
  isOwner: boolean;
}

export const MusicianMedia = ({ musician, isOwner }: MusicianMediaProps) => {
  return (
    <div className="mt-12 bg-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-12">
          <div>
            <div className="flex items-center justify-between mb-6">
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
            <div className="flex items-center justify-between mb-6">
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
    </div>
  );
};