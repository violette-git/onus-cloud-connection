import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { User, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
}

export const CommentItem = ({ comment, onDelete }: CommentItemProps) => {
  const { user } = useAuth();

  return (
    <Card>
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
              onClick={() => onDelete(comment.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="mt-3">{comment.content}</p>
      </CardContent>
    </Card>
  );
};