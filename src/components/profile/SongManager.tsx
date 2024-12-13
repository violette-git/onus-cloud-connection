import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SunoPlayer } from "./SunoPlayer";
import { CommentButton } from "./comments/CommentButton";
import type { Song } from "@/types/profile";

interface SongManagerProps {
  musicianId: string;
  songs: Song[];
  isOwner?: boolean;
}

export const SongManager = ({ musicianId, songs, isOwner = false }: SongManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newSong, setNewSong] = useState({ title: "", url: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const extractSongId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      if (!urlObj.hostname.includes('suno')) {
        return null;
      }
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1];
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const songId = extractSongId(newSong.url);
    if (!songId) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please provide a valid Suno song URL.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('songs')
        .insert({
          musician_id: musicianId,
          title: newSong.title,
          url: songId, // Store just the song ID
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your song has been added.",
      });

      setNewSong({ title: "", url: "" });
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ['musician'] });
    } catch (error) {
      console.error('Error adding song:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add song. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (songId: string) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Song has been removed.",
      });

      queryClient.invalidateQueries({ queryKey: ['musician'] });
    } catch (error) {
      console.error('Error deleting song:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete song. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Songs</h3>
        {!isAdding && isOwner && (
          <Button onClick={() => setIsAdding(true)} variant="outline">
            Add Song
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
              value={newSong.title}
              onChange={(e) => setNewSong(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Suno Song URL
            </label>
            <Input
              id="url"
              type="url"
              value={newSong.url}
              onChange={(e) => setNewSong(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://suno.com/song/your-song-id"
              required
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Song"}
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
        {songs.map((song) => (
          <div
            key={song.id}
            className="p-4 border rounded-lg space-y-2"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{song.title}</h4>
              <div className="flex items-center gap-2">
                <CommentButton contentId={song.id} contentType="song" />
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(song.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
            <SunoPlayer songId={song.url} />
          </div>
        ))}
      </div>
    </div>
  );
};