import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CommentSection } from "@/components/profile/comments/CommentSection";
import { useAuth } from "@/contexts/AuthContext";

export const ForumTopicView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: topic, isLoading } = useQuery({
    queryKey: ['forum-topic', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_topics')
        .select(`
          *,
          user:profiles!forum_topics_user_id_fkey (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateCommentSection = () => {
    queryClient.invalidateQueries({ 
      queryKey: ['comments', 'forum', id] 
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted w-1/4 rounded" />
        <div className="h-4 bg-muted w-2/3 rounded" />
        <div className="h-32 bg-muted rounded-lg" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Topic not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/forum" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Forum
        </Link>
      </Button>

      <div className="border rounded-lg p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{topic.title}</h1>
            <div className="text-sm text-muted-foreground">
              Posted by {topic.user?.full_name || 'Anonymous'} • 
              {new Date(topic.created_at).toLocaleDateString()}
            </div>
          </div>
          {user?.id === topic.user_id && (
            <Button variant="outline" size="sm">
              Edit Topic
            </Button>
          )}
        </div>

        <div className="prose dark:prose-invert mb-8">
          {topic.content}
        </div>

        <CommentSection 
          contentId={topic.id}
          contentType="forum"
        />
      </div>
    </div>
  );
};
