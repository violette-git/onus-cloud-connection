import { Button } from "@/components/ui/button";
import { Music2, Video } from "lucide-react";
import { SongManager } from "../SongManager";
import { VideoManager } from "../VideoManager";
import { VideoEmbed } from "../VideoEmbed";
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
            {musician.songs && musician.songs.length > 0 ? (
              <div className="space-y-4">
                {musician.songs.map((song) => (
                  <div key={song.id} className="p-4 bg-card rounded-lg">
                    <h3 className="font-medium mb-2">{song.title}</h3>
                    <audio controls className="w-full">
                      <source src={song.url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No songs added yet</p>
            )}
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
            {musician.videos && musician.videos.length > 0 ? (
              <div className="space-y-4">
                {musician.videos.map((video) => (
                  <div key={video.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{video.title}</h3>
                    </div>
                    <VideoEmbed video={video} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No videos added yet</p>
            )}
            {isOwner && (
              <VideoManager 
                musicianId={musician.id} 
                videos={musician.videos || []}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};