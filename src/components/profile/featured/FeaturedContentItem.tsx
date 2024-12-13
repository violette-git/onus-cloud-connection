import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import { SunoPlayer } from "../SunoPlayer";
import { VideoEmbed } from "../VideoEmbed";
import type { Song, Video } from "@/types/profile";
import type { FeaturedItem } from "./types";

interface FeaturedContentItemProps {
  item: FeaturedItem;
  songs: Song[];
  videos: Video[];
  isEditing: boolean;
  onRemove: (id: string) => void;
  onDragStart: (item: FeaturedItem) => void;
  onDragOver: (e: React.DragEvent, item: FeaturedItem) => void;
}

export const FeaturedContentItem = ({
  item,
  songs,
  videos,
  isEditing,
  onRemove,
  onDragStart,
  onDragOver,
}: FeaturedContentItemProps) => {
  const renderContent = () => {
    if (item.content_type === 'song') {
      const song = songs.find(s => s.id === item.content_id);
      if (!song) return null;
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{song.title}</h3>
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
              >
                Remove
              </Button>
            )}
          </div>
          <SunoPlayer songId={song.url} />
        </div>
      );
    }

    if (item.content_type === 'video') {
      const video = videos.find(v => v.id === item.content_id);
      if (!video) return null;
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{video.title}</h3>
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
              >
                Remove
              </Button>
            )}
          </div>
          <VideoEmbed video={video} />
        </div>
      );
    }
  };

  return (
    <div
      className="relative"
      draggable={isEditing}
      onDragStart={() => onDragStart(item)}
      onDragOver={(e) => onDragOver(e, item)}
    >
      {isEditing && (
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 cursor-move">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      {renderContent()}
    </div>
  );
};