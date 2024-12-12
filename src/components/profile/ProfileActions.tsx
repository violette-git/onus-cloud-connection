import { Button } from "@/components/ui/button";
import { Music2, Share2, MessageCircle } from "lucide-react";
import { SocialLinksSection } from "./SocialLinks";
import { CollaborationRequests } from "./CollaborationRequests";
import { MessageDialog } from "../profile/musician-actions/MessageDialog";
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
    <div className="mt-32 px-4 md:px-8 max-w-2xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {profile.role === 'observer' && isOwner && (
            <Button 
              onClick={onBecomeMusicianClick}
              className="bg-onus-purple hover:bg-onus-purple/90"
            >
              <Music2 className="mr-2 h-4 w-4" />
              Become a Musician
            </Button>
          )}
          {profile.role === 'musician' && !isOwner && (
            <>
              <Button className="gradient-border">
                <Music2 className="mr-2 h-4 w-4" />
                Follow
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <MessageDialog recipientId={profile.id}>
                <Button variant="secondary">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </MessageDialog>
            </>
          )}
        </div>
        <SocialLinksSection
          initialLinks={profile.social_links || { instagram: "", youtube: "", linkedin: "" }}
          isOwner={isOwner}
          onSave={onSocialLinksUpdate}
        />
      </div>
      {isOwner && profile.role === 'musician' && (
        <div className="mt-8">
          <CollaborationRequests musicianId={profile.id} />
        </div>
      )}
    </div>
  );
};