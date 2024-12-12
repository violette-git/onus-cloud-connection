import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VideoPlatform } from "@/types/profile";

interface VideoFormProps {
  isSubmitting: boolean;
  newVideo: {
    title: string;
    url: string;
    platform: VideoPlatform | "";
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string) => void;
  onCancel: () => void;
}

export const VideoForm = ({ 
  isSubmitting, 
  newVideo, 
  onSubmit, 
  onChange,
  onCancel 
}: VideoFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          value={newVideo.title}
          onChange={(e) => onChange('title', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="platform" className="text-sm font-medium">
          Platform
        </label>
        <Select
          value={newVideo.platform}
          onValueChange={(value) => onChange('platform', value)}
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
          onChange={(e) => onChange('url', e.target.value)}
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
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};