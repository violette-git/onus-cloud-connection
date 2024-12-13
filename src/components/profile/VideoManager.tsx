import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { VideoForm } from "./VideoForm";
import { VideoEmbed } from "./VideoEmbed";
import { CommentButton } from "./comments/CommentButton";
import type { Video, VideoPlatform } from "@/types/profile";

interface VideoManagerProps {
  musicianId: string;
  videos: Video[];
  isOwner?: boolean;
}

export const VideoManager = ({ musicianId, videos, isOwner = false }: VideoManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newVideo, setNewVideo] = useState({ 
    title: "", 
    url: "", 
    platform: "" as VideoPlatform | "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('videos')
        .insert({
          musician_id: musicianId,
          title: newVideo.title,
          url: newVideo.url,
          platform: newVideo.platform,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your video has been added.",
      });

      setNewVideo({ title: "", url: "", platform: "" });
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ['musician'] });
    } catch (error) {
      console.error('Error adding video:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add video. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Video has been removed.",
      });

      queryClient.invalidateQueries({ queryKey: ['musician'] });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete video. Please try again.",
      });
    }
  };

  const handleVideoFormChange = (field: string, value: string) => {
    setNewVideo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Videos</h3>
        {!isAdding && isOwner && (
          <Button onClick={() => setIsAdding(true)} variant="outline">
            Add Video
          </Button>
        )}
      </div>

      {isAdding && (
        <VideoForm
          isSubmitting={isSubmitting}
          newVideo={newVideo}
          onSubmit={handleSubmit}
          onChange={handleVideoFormChange}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <div className="space-y-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="p-4 border rounded-lg space-y-2"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{video.title}</h4>
                <p className="text-sm text-muted-foreground capitalize">{video.platform}</p>
              </div>
              <div className="flex items-center gap-2">
                <CommentButton contentId={video.id} contentType="video" />
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(video.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
            <VideoEmbed video={video} />
          </div>
        ))}
      </div>
    </div>
  );
};