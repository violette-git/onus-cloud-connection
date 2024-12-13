import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { User, Trash2, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    user: {
      username: string;
      full_name: string;
      avatar_url: string;
    };
  };
  onDelete: (id: string) => void;
  onReply: (content: string, parentId: string) => void;
  depth?: number;
}

export const CommentItem = ({ comment, onDelete, onReply, depth = 0 }: CommentItemProps) => {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = (content: string) => {
    onReply(content, comment.id);
    setIsReplying(false);
  };

  const maxDepth = 5;
  const canReply = depth < maxDepth;

  // Calculate indentation and line styles
  const indentationWidth = 28; // Fixed width for each level of indentation
  const marginLeft = depth * indentationWidth;
  
  return (
    <div 
      className="relative"
      style={{ marginLeft: `${marginLeft}px` }}
    >
      {/* Connection line */}
      {depth > 0 && (
        <div 
          className="absolute left-0 bottom-0 w-[2px] bg-border opacity-30"
          style={{ 
            left: '-16px',
            height: '100%',
            bottom: '20px', // Start from the bottom and go up
          }}
        />
      )}
      {/* Horizontal connector line */}
      {depth > 0 && (
        <div 
          className="absolute w-3 h-[2px] bg-border opacity-30"
          style={{ 
            left: '-16px',
            top: '20px', // Keep aligned with the avatar
          }}
        />
      )}
      
      <Card className="bg-secondary/50">
        <CardContent className="p-3">
          <div className="flex justify-between items-start gap-2">
            <div className="flex gap-2 items-center flex-1 min-w-0">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={comment.user.avatar_url}
                  alt={comment.user.username || comment.user.full_name}
                />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {comment.user.username || comment.user.full_name}
                </p>
                <p className="text-xs text-muted-foreground">
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
                onClick={() => onDelete(comment.id)}
                className="text-destructive hover:text-destructive h-8 w-8"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
          <p className="mt-2 text-sm break-words">{comment.content}</p>
          {canReply && user && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground h-7 text-xs px-2"
                onClick={() => setIsReplying(!isReplying)}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Reply
              </Button>
            </div>
          )}
          {isReplying && (
            <div className="mt-3">
              <CommentForm
                onSubmit={handleReply}
                isSubmitting={false}
                autoFocus
                placeholder="Write a reply..."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};