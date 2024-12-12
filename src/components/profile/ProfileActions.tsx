import { Button } from "@/components/ui/button";
import { Music2, Share2 } from "lucide-react";
import { SocialLinksSection } from "./SocialLinks";
import type { Profile, SocialLinks } from "@/types/profile";

interface ProfileActionsProps {
  profile: Profile;
  isOwner: boolean;
  onBecomeMusicianClick: () => void;
  onSocialLinksUpdate: (links: SocialLinks) => void;
}

export const ProfileActions = ({ 
  profile, 
  isOwner, 
  onBecomeMusicianClick,
  onSocialLinksUpdate 
}: ProfileActionsProps) => {
  return (
    <div className="mt-20 px-8 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {profile.role === 'observer' ? (
          <Button onClick={onBecomeMusicianClick}>
            <Music2 className="mr-2 h-4 w-4" />
            Become a Musician
          </Button>
        ) : (
          <>
            <Button className="gradient-border">
              <Music2 className="mr-2 h-4 w-4" />
              Follow
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </>
        )}
      </div>
      <SocialLinksSection
        initialLinks={profile.social_links || { instagram: "", youtube: "", linkedin: "" }}
        isOwner={isOwner}
        onSave={onSocialLinksUpdate}
      />
    </div>
  );
};