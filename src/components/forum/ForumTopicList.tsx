import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const ForumTopicList = () => {
  const { data: topics, isLoading } = useQuery({
    queryKey: ['forum-topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_topics')
        .select(`
          *,
          user:profiles!forum_topics_user_id_fkey (
            username,
            full_name,
            avatar_url
          ),
          comment_count:comments!comments_forum_topic_id_fkey (count)
        `)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Community Forum</h1>
        <Button asChild>
          <Link to="/forum/new">
            <Plus className="mr-2 h-4 w-4" />
            New Topic
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>
      )}

      {topics?.map(topic => (
        <div key={topic.id} className="p-4 border rounded-lg hover:bg-accent/50">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Link 
                  to={`/forum/${topic.id}/${topic.slug}`}
                  className="font-semibold hover:underline"
                >
                  {topic.title}
                </Link>
                {topic.is_pinned && (
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                    Pinned
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Posted by {topic.user?.full_name || 'Anonymous'} • 
                {new Date(topic.created_at).toLocaleDateString()} • 
                {topic.comment_count[0]?.count || 0} comments
              </div>
            </div>
            {topic.is_locked && (
              <span className="text-muted-foreground text-sm">
                Locked
              </span>
            )}
          </div>
        </div>
      ))}

      {!isLoading && (!topics || topics.length === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          No discussion topics yet. Be the first to start one!
        </div>
      )}
    </div>
  );
};
