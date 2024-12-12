import { Music2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoEmbed } from "@/components/profile/VideoEmbed";
import type { Musician } from "@/types/musician";

interface MusicianMediaProps {
  musician: Musician;
  isOwner: boolean;
}

export const MusicianMedia = ({ musician, isOwner }: MusicianMediaProps) => {
  return (
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {musician.songs?.map((song) => (
            <div key={song.id} className="p-6 rounded-lg border bg-card">
              <h3 className="font-medium mb-3">{song.title}</h3>
              <audio
                className="w-full"
                controls
                src={song.url}
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          ))}
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {musician.videos?.map((video) => (
            <div key={video.id} className="p-6 rounded-lg border bg-card">
              <h3 className="font-medium mb-3">{video.title}</h3>
              <div className="aspect-video">
                <VideoEmbed video={video} />
              </div>
            </div>
          ))}
        </div>
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
  );
};