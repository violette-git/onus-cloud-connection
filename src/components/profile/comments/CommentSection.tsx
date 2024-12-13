import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { User, MessageSquare, Trash2 } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

interface CommentSectionProps {
  contentId: string;
  contentType: 'musician' | 'song' | 'video';
}

export const CommentSection = ({ contentId, contentType }: CommentSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', contentId],
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
      return data as Comment[];
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from('comments')
        .insert({
          content,
          content_type: contentType,
          content_id: contentId,
          user_id: user?.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', contentId] });
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    },
    onError: () => {
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
      queryClient.invalidateQueries({ queryKey: ['comments', contentId] });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to post comments.",
      });
      return;
    }
    if (!newComment.trim()) return;
    addCommentMutation.mutate(newComment.trim());
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Comments</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[100px]"
        />
        <Button 
          type="submit" 
          disabled={!user || addCommentMutation.isPending}
        >
          Post Comment
        </Button>
      </form>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={comment.user.avatar_url}
                      alt={comment.user.username || comment.user.full_name}
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {comment.user.username || comment.user.full_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                {user?.id === comment.user_id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="mt-3">{comment.content}</p>
            </CardContent>
          </Card>
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