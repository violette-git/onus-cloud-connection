import { ProfileHeader } from "./ProfileHeader";
import { ProfileActions } from "./ProfileActions";
import { ProfileContent } from "./ProfileContent";
import { ThemeCustomization } from "./ThemeCustomization";
import { ProfileSettings } from "./ProfileSettings";
import type { Profile, Musician, SocialLinks } from "@/types/profile";

interface ProfileViewProps {
  profile: Profile;
  musician: Musician | null;
  isOwner: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onThemeUpdate: (colors: { primary: string; secondary: string; accent: string }) => void;
  onSocialLinksUpdate: (links: SocialLinks) => void;
  onBecomeMusicianClick: () => void;
  onMusicianProfileCreated: () => void;
}

export const ProfileView = ({
  profile,
  musician,
  isOwner,
  onImageUpload,
  onBannerUpload,
  onThemeUpdate,
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

        {isOwner && (
          <div className="mt-8 space-y-8">
            <ProfileSettings
              profile={profile}
              onUpdate={(updates) => onProfileUpdate(updates)}
              isLoading={updateProfileMutation.isPending}
            />
            
            <ThemeCustomization
              profile={profile}
              onThemeUpdate={onThemeUpdate}
              onBannerUpload={onBannerUpload}
            />
          </div>
        )}

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