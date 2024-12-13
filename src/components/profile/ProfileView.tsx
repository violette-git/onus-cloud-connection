import { ProfileHeader } from "./ProfileHeader";
import { ProfileActions } from "./ProfileActions";
import { ProfileContent } from "./ProfileContent";
import type { Profile, Musician, SocialLinks } from "@/types/profile";

interface ProfileViewProps {
  profile: Profile;
  musician: Musician | null;
  isOwner: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSocialLinksUpdate: (links: SocialLinks) => void;
  onBecomeMusicianClick: () => void;
  onMusicianProfileCreated: () => void;
}

export const ProfileView = ({
  profile,
  musician,
  isOwner,
  onImageUpload,
  onSocialLinksUpdate,
  onBecomeMusicianClick,
  onMusicianProfileCreated
}: ProfileViewProps) => {
  return (
    <div className="animate-fade-in pb-12 min-h-screen bg-background">
      <div className="onus-container">
        <ProfileHeader 
          profile={profile}
          musician={musician}
          isOwner={isOwner}
          onImageUpload={onImageUpload}
        />

        <ProfileActions 
          profile={profile}
          isOwner={isOwner}
          onSocialLinksUpdate={onSocialLinksUpdate}
          onBecomeMusicianClick={onBecomeMusicianClick}
        />

        <div className="mt-8">
          <ProfileContent 
            musician={musician} 
            onProfileCreated={onMusicianProfileCreated}
            profile={profile}
            isOwner={isOwner}
          />
        </div>
      </div>
    </div>
  );
};