import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CommentButtonProps {
  contentId: string;
  contentType: 'song' | 'video';
  count?: number;
}

export const CommentButton = ({ contentId, contentType, count = 0 }: CommentButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-foreground"
      onClick={() => navigate(`/comments/${contentType}/${contentId}`)}
    >
      <MessageSquare className="h-4 w-4 mr-1" />
      {count} Comments
    </Button>
  );
};