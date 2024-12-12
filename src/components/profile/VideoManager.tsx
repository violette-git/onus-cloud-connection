import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Video } from "@/types/profile";

interface VideoManagerProps {
  musicianId: string;
  videos: Video[];
}

export const VideoManager = ({ musicianId, videos }: VideoManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: "", url: "", platform: "" as "youtube" | "tiktok" });
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

      setNewVideo({ title: "", url: "", platform: "" as "youtube" | "tiktok" });
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

  const renderVideoEmbed = (video: Video) => {
    if (video.platform === 'youtube') {
      const videoId = video.url.split('v=')[1]?.split('&')[0];
      if (!videoId) return null;
      return (
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
          />
        </div>
      );
    } else if (video.platform === 'tiktok') {
      return (
        <div className="tiktok-embed">
          <blockquote className="tiktok-embed" cite={video.url}>
            <a href={video.url}>View on TikTok</a>
          </blockquote>
          <script async src="https://www.tiktok.com/embed.js"></script>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Videos</h3>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} variant="outline">
            Add Video
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={newVideo.title}
              onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="platform" className="text-sm font-medium">
              Platform
            </label>
            <Select
              value={newVideo.platform}
              onValueChange={(value) => setNewVideo(prev => ({ ...prev, platform: value as "youtube" | "tiktok" }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Video URL
            </label>
            <Input
              id="url"
              type="url"
              value={newVideo.url}
              onChange={(e) => setNewVideo(prev => ({ ...prev, url: e.target.value }))}
              placeholder={newVideo.platform === 'youtube' ? 
                "https://www.youtube.com/watch?v=..." : 
                "https://www.tiktok.com/@username/video/..."
              }
              required
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Video"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(video.id)}
                className="text-destructive hover:text-destructive"
              >
                Delete
              </Button>
            </div>
            {renderVideoEmbed(video)}
          </div>
        ))}
      </div>
    </div>
  );
};