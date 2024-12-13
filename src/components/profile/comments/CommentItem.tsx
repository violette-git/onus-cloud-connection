import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { CommentForm } from "./CommentForm";
import { CommentHeader } from "./CommentHeader";
import { CommentReplyButton } from "./CommentReplyButton";
import { CommentConnector } from "./CommentConnector";

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
  const indentationWidth = 28;
  const marginLeft = depth * indentationWidth;
  
  return (
    <div 
      className="relative"
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <CommentConnector depth={depth} />
      
      <Card className="bg-secondary/50">
        <CardContent className="p-3">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <CommentHeader
                user={comment.user}
                created_at={comment.created_at}
                canDelete={user?.id === comment.user_id}
                onDelete={() => onDelete(comment.id)}
              />

              <p className="mt-2 text-sm break-words">{comment.content}</p>
            </div>

            {canReply && user && (
              <CommentReplyButton
                onReplyClick={() => setIsReplying(!isReplying)}
                isReplying={isReplying}
              />
            )}
          </div>

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