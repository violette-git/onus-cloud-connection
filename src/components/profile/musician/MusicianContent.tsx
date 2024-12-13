import { Button } from "@/components/ui/button";
import { VideoEmbed } from "@/components/profile/VideoEmbed";
import { Music2, Video } from "lucide-react";
import type { Musician } from "@/types/profile";

interface MusicianContentProps {
  musician: Musician;
  isOwner: boolean;
}

export const MusicianContent = ({ musician, isOwner }: MusicianContentProps) => {
  return (
    <div className="onus-container grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
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
            <div className="grid gap-6">
              {musician.songs.map((song) => (
                <div key={song.id} className="p-6 bg-card rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{song.title}</h3>
                    {isOwner && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        Delete
                      </Button>
                    )}
                  </div>
                  <audio controls className="w-full">
                    <source src={song.url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card/50 rounded-lg border border-dashed">
              <Music2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-4">No songs added yet</p>
            </div>
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
            <div className="grid gap-6">
              {musician.videos.map((video) => (
                <div key={video.id} className="p-6 bg-card rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{video.title}</h3>
                    {isOwner && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        Delete
                      </Button>
                    )}
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <VideoEmbed video={video} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card/50 rounded-lg border border-dashed">
              <Video className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-4">No videos added yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">About</h3>
          {musician.bio ? (
            <p className="text-muted-foreground">{musician.bio}</p>
          ) : (
            <p className="text-muted-foreground italic">No bio available</p>
          )}
        </div>

        {musician.musician_genres && musician.musician_genres.length > 0 && (
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Genres</h3>
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
        )}
      </div>
    </div>
  );
};