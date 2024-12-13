import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

interface CommentSectionProps {
  contentId: string;
  contentType: 'song' | 'video';
}

export const CommentSection = ({ contentId, contentType }: CommentSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', contentType, contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:profiles!comments_user_id_fkey (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user?.id) throw new Error('User must be logged in to comment');

      const { error } = await supabase
        .from('comments')
        .insert({
          content,
          content_type: contentType,
          content_id: contentId,
          user_id: user.id,
        })
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', contentType, contentId] });
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post comment. Please try again.",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', contentType, contentId] });
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete comment. Please try again.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Comments</h2>
      </div>

      <CommentForm
        onSubmit={(content) => addCommentMutation.mutate(content)}
        isSubmitting={addCommentMutation.isPending}
      />

      <div className="space-y-4">
        {comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={(id) => deleteCommentMutation.mutate(id)}
          />
        ))}

        {comments?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};