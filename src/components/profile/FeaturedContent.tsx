import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SunoPlayer } from "./SunoPlayer";
import { VideoEmbed } from "./VideoEmbed";
import { GripVertical } from "lucide-react";
import type { Song, Video } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";

interface FeaturedContentProps {
  musicianId: string;
  isOwner: boolean;
  songs: Song[];
  videos: Video[];
}

interface FeaturedItem {
  id: string;
  musician_id: string;
  content_type: 'song' | 'video';
  content_id: string;
  display_order: number;
}

export const FeaturedContent = ({ musicianId, isOwner, songs, videos }: FeaturedContentProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [draggedItem, setDraggedItem] = useState<FeaturedItem | null>(null);

  const { data: featuredItems, isLoading } = useQuery({
    queryKey: ['featured-content', musicianId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_content')
        .select('*')
        .eq('musician_id', musicianId)
        .order('display_order');

      if (error) throw error;
      return data as FeaturedItem[];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (item: Omit<FeaturedItem, 'id'>) => {
      const { error } = await supabase
        .from('featured_content')
        .insert(item);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-content', musicianId] });
      toast({
        title: "Content featured successfully",
        description: "Your selected content has been added to the featured section.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to feature content. Please try again.",
      });
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('featured_content')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-content', musicianId] });
      toast({
        title: "Content removed",
        description: "The content has been removed from your featured section.",
      });
    }
  });

  const reorderMutation = useMutation({
    mutationFn: async (items: FeaturedItem[]) => {
      const { error } = await supabase
        .from('featured_content')
        .upsert(
          items.map(item => ({
            id: item.id,
            musician_id: item.musician_id,
            content_type: item.content_type,
            content_id: item.content_id,
            display_order: item.display_order
          }))
        );
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-content', musicianId] });
    }
  });

  const handleDragStart = (item: FeaturedItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent, targetItem: FeaturedItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const items = featuredItems?.slice() || [];
    const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
    const targetIndex = items.findIndex(item => item.id === targetItem.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder items
    items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, draggedItem);

    // Update display order
    const updatedItems = items.map((item, index) => ({
      ...item,
      display_order: index
    }));

    reorderMutation.mutate(updatedItems);
  };

  if (isLoading) return null;

  const songCount = featuredItems?.filter(item => item.content_type === 'song').length ?? 0;
  const videoCount = featuredItems?.filter(item => item.content_type === 'video').length ?? 0;

  const canAddSong = songCount < 3;
  const canAddVideo = videoCount < 1;

  if (!featuredItems?.length && !isOwner) return null;

  const renderContent = (item: FeaturedItem) => {
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
                onClick={() => removeMutation.mutate(item.id)}
              >
                Remove
              </Button>
            )}
          </div>
          <SunoPlayer songId={song.id} />
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
                onClick={() => removeMutation.mutate(item.id)}
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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Featured Content</h2>
          {isOwner && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Done" : "Manage Featured"}
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-6">
            {featuredItems?.map((item) => (
              <div 
                key={item.id} 
                className="relative"
                draggable={true}
                onDragStart={() => handleDragStart(item)}
                onDragOver={(e) => handleDragOver(e, item)}
              >
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 cursor-move">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                {renderContent(item)}
              </div>
            ))}

            <div className="flex flex-wrap gap-2 pt-4 border-t">
              {canAddSong && songs.map(song => (
                <Button
                  key={song.id}
                  variant="outline"
                  size="sm"
                  onClick={() => addMutation.mutate({
                    musician_id: musicianId,
                    content_type: 'song',
                    content_id: song.id,
                    display_order: (featuredItems?.length ?? 0)
                  })}
                >
                  + Feature "{song.title}"
                </Button>
              ))}
              
              {canAddVideo && videos.map(video => (
                <Button
                  key={video.id}
                  variant="outline"
                  size="sm"
                  onClick={() => addMutation.mutate({
                    musician_id: musicianId,
                    content_type: 'video',
                    content_id: video.id,
                    display_order: (featuredItems?.length ?? 0)
                  })}
                >
                  + Feature "{video.title}"
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {featuredItems?.map((item) => (
              <div key={item.id}>
                {renderContent(item)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};