import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentSection } from "@/components/profile/comments/CommentSection";

export const Comments = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  if (!type || !id) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <CommentSection contentId={id} contentType={type as 'song' | 'video'} />
    </div>
  );
};