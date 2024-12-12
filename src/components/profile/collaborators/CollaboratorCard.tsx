import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/profile";

interface CollaboratorCardProps {
  id: string;
  name: string;
  profile?: Profile;
}

export const CollaboratorCard = ({ id, name, profile }: CollaboratorCardProps) => {
  const navigate = useNavigate();

  const displayName = profile?.full_name || profile?.username || name;

  return (
    <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg animate-fade-in">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 ring-1 ring-border">
          <AvatarImage 
            src={profile?.avatar_url || undefined}
            alt={displayName}
            className="object-cover w-full h-full"
          />
          <AvatarFallback>
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{displayName}</span>
      </div>
      <Button
        variant="ghost"
        onClick={() => navigate(`/musicians/${id}`)}
      >
        View Profile
      </Button>
    </div>
  );
};