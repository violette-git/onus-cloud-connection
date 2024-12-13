import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isSubmitting: boolean;
}

export const CommentForm = ({ onSubmit, isSubmitting }: CommentFormProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent("");
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
        placeholder="Write a comment..."
        className="min-h-[100px]"
      />
      <Button type="submit" disabled={isSubmitting}>
        Post Comment
      </Button>
    </form>
  );
};