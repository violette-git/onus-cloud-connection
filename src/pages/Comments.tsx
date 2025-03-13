import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentSection } from "@/components/profile/comments/CommentSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VideoEmbed } from "@/components/profile/VideoEmbed";
import { SunoPlayer } from "@/components/profile/SunoPlayer";
import { Card } from "@/components/ui/card";
import type { Video } from "@/types/database";
import type { Profile } from "@/types/profile";

interface SongContent {
  id: string;
  title: string;
  url: string;
  musician?: {
    name: string;
  };
}

interface VideoContent extends Video {
  musician?: {
    name: string;
  };
}

export const Comments = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const { data: content, isLoading: isLoadingContent } = useQuery({
    queryKey: ['content', type, id],
    queryFn: async () => {
      if (!type || !id) return null;
      
      const table = type === 'song' ? 'songs' : 'videos';
      const { data, error } = await supabase
        .from(table)
        .select(`*
          ,
          musician:musicians (
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as SongContent | VideoContent;
    },
    enabled: !!type && !!id,
  });

  if (!type || !id) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {content && (
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
            <p className="text-muted-foreground mb-4">
              By {content.musician?.name}
            </p>
            {type === 'video' ? (
              <VideoEmbed video={content as VideoContent} />
            ) : (
              <SunoPlayer songId={content.url} />
            )}
          </div>
        </Card>
      )}
      
      <CommentSection contentId={id} contentType={type as 'song' | 'video'} />
    </div>
  );
};
