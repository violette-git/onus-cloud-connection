import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import type { Song, Video } from "@/types/profile";

interface FeaturedContentManagerProps {
  songs: Song[];
  videos: Video[];
  featuredSongs: number;
  featuredVideos: number;
  onAddSong: (songId: string) => void;
  onAddVideo: (videoId: string) => void;
}

export const FeaturedContentManager = ({
  songs,
  videos,
  featuredSongs,
  featuredVideos,
  onAddSong,
  onAddVideo,
}: FeaturedContentManagerProps) => {
  const canAddSong = featuredSongs < 3;
  const canAddVideo = featuredVideos < 1;

  if (!canAddSong && !canAddVideo) return null;

  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-4 p-4">
        {canAddSong && (
          <div>
            <h4 className="text-sm font-medium mb-2">Add Songs (up to 3)</h4>
            <div className="flex flex-wrap gap-2">
              {songs.map((song) => (
                <Button
                  key={song.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onAddSong(song.id)}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {song.title}
                </Button>
              ))}
            </div>
          </div>
        )}

        {canAddVideo && (
          <div>
            <h4 className="text-sm font-medium mb-2">Add Video (1 max)</h4>
            <div className="flex flex-wrap gap-2">
              {videos.map((video) => (
                <Button
                  key={video.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onAddVideo(video.id)}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {video.title}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
