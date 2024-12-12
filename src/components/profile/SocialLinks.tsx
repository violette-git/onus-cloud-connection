import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import { useState } from "react";
import type { SocialLinks } from "@/types/profile";

interface SocialLinksProps {
  initialLinks: SocialLinks;
  isOwner: boolean;
  onSave: (links: SocialLinks) => void;
}

export const SocialLinksSection = ({ initialLinks, isOwner, onSave }: SocialLinksProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(initialLinks);

  const handleSave = async () => {
    await onSave(socialLinks);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-4">
        <Input
          placeholder="Instagram URL"
          value={socialLinks.instagram}
          onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
          className="w-48"
        />
        <Input
          placeholder="YouTube URL"
          value={socialLinks.youtube}
          onChange={(e) => setSocialLinks(prev => ({ ...prev, youtube: e.target.value }))}
          className="w-48"
        />
        <Input
          placeholder="LinkedIn URL"
          value={socialLinks.linkedin}
          onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
          className="w-48"
        />
        <Button onClick={handleSave}>Save</Button>
        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {isOwner && (
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          Edit Links
        </Button>
      )}
      {socialLinks.instagram && (
        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
          <Instagram className="h-5 w-5" />
        </a>
      )}
      {socialLinks.youtube && (
        <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
          <Youtube className="h-5 w-5" />
        </a>
      )}
      {socialLinks.linkedin && (
        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
          <Linkedin className="h-5 w-5" />
        </a>
      )}
    </div>
  );
};