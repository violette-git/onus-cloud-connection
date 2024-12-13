import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  parent_id: string | null;
  user: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    role: string;
  };
}

export const Comments = () => {
  const { type, id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", type, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          user:profiles!comments_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url,
            role
          )
        `)
        .eq("content_type", type)
        .eq("content_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Comment[];
    },
    enabled: !!type && !!id,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user?.id || !type || !id) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("comments")
        .insert({
          content,
          user_id: user.id,
          content_type: type,
          content_id: id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", type, id] });
      setNewComment("");
      toast({
        title: "Success",
        description: "Your comment has been added.",
      });
    },
    onError: (error) => {
      console.error("Error adding comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add your comment. Please try again.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please sign in to comment.",
      });
      return;
    }
    if (!newComment.trim()) return;
    addCommentMutation.mutate(newComment);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">
          Please sign in to view and add comments.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">Comments</h1>
          
          <form onSubmit={handleSubmit} className="mb-8">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="mb-4"
            />
            <Button 
              type="submit"
              disabled={addCommentMutation.isPending}
            >
              {addCommentMutation.isPending ? "Posting..." : "Post Comment"}
            </Button>
          </form>

          <ScrollArea className="h-[600px]">
            {isLoading ? (
              <div className="text-center text-muted-foreground">
                Loading comments...
              </div>
            ) : comments?.length === 0 ? (
              <div className="text-center text-muted-foreground">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="space-y-4">
                {comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={comment.user.avatar_url}
                        alt={comment.user.username || comment.user.full_name}
                      />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {comment.user.username || comment.user.full_name}
                        </span>
                        <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                          {comment.user.role}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};