import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CommentHeaderProps {
  user: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
  created_at: string;
  canDelete: boolean;
  onDelete: () => void;
}

export const CommentHeader = ({ user, created_at, canDelete, onDelete }: CommentHeaderProps) => {
  return (
    <div className="flex justify-between items-start gap-2">
      <div className="flex gap-2 items-center flex-1 min-w-0">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={user.avatar_url}
            alt={user.username || user.full_name}
          />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm truncate">
              {user.username || user.full_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(created_at), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </div>
      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-destructive hover:text-destructive h-8 w-8"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};