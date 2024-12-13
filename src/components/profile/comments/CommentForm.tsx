import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isSubmitting: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

export const CommentForm = ({ 
  onSubmit, 
  isSubmitting, 
  autoFocus = false,
  placeholder = "Write a comment..."
}: CommentFormProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!user) {
    return (
      <p className="text-center text-muted-foreground">
        Please sign in to post comments.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="min-h-[100px]"
        autoFocus={autoFocus}
      />
      <Button type="submit" disabled={isSubmitting}>
        Post Comment
      </Button>
    </form>
  );
};