import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, MessageSquareOff } from "lucide-react";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import { CommentPreferences } from "@/types/database";
import { ensureCommentPreferences } from "@/types/database";

interface CommentSectionProps {
  contentId: string;
  contentType: 'song' | 'video';
}

export const CommentSection = ({ contentId, contentType }: CommentSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch content owner's profile to check if comments are disabled
  const { data: contentOwner } = useQuery({
    queryKey: ['content-owner', contentType, contentId],
    queryFn: async () => {
      const table = contentType === 'song' ? 'songs' : 'videos';
      try {
        const { data: content, error: contentError } = await supabase
          .from(table)
          .select(`
            musician:musicians!inner (
              user:profiles!musicians_user_id_fkey (
                comment_preferences
              )
            )
          `)
          .eq('id', contentId)
          .maybeSingle();

        if (contentError) throw contentError;
        if (!content) return null;
        
        return content?.musician?.user;
      } catch (error) {
        console.error('Error fetching content owner:', error);
        return null;
      }
    },
  });

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
        .order('thread_path', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string, parentId?: string }) => {
      if (!user?.id) throw new Error('User must be logged in to comment');

      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          content_type: contentType,
          content_id: contentId,
          user_id: user.id,
          parent_id: parentId || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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

  const buildCommentTree = (comments: any[]) => {
    const commentMap = new Map();
    const roots: any[] = [];

    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    comments.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        }
      } else {
        roots.push(commentMap.get(comment.id));
      }
    });

    return roots;
  };

  const renderComments = (comments: any[], depth = 0) => {
    return comments.map(comment => (
      <div key={comment.id} className="space-y-4">
        <CommentItem
          comment={comment}
          onDelete={(id) => deleteCommentMutation.mutate(id)}
          onReply={(content, parentId) => 
            addCommentMutation.mutate({ content, parentId })
          }
          depth={depth}
        />
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-8 space-y-4">
            {renderComments(comment.replies, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
      </div>
    );
  }

  const commentsDisabled = contentOwner?.comment_preferences ? 
    (contentOwner.comment_preferences as CommentPreferences).disable_comments : 
    false;

  if (commentsDisabled) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquareOff className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Comments are disabled</h2>
        </div>
        <p className="text-center text-muted-foreground">
          The creator has disabled comments for this content.
        </p>
      </div>
    );
  }

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Comments</h2>
      </div>

      <CommentForm
        onSubmit={(content) => addCommentMutation.mutate({ content })}
        isSubmitting={addCommentMutation.isPending}
      />

      <div className="space-y-4">
        {renderComments(commentTree)}

        {(!comments || comments.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};
