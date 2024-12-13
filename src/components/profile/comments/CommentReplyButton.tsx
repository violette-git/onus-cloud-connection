import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommentReplyButtonProps {
  onReplyClick: () => void;
  isReplying: boolean;
}

export const CommentReplyButton = ({ onReplyClick, isReplying }: CommentReplyButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground h-7 text-xs px-2"
      onClick={() => onReplyClick()}
    >
      <MessageSquare className="h-3 w-3 mr-1" />
      {isReplying ? 'Cancel' : 'Reply'}
    </Button>
  );
};