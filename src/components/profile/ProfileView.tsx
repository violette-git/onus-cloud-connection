import { ProfileHeader } from "./ProfileHeader";
import { ProfileActions } from "./ProfileActions";
import { ProfileContent } from "./ProfileContent";
import { ProfileSettings } from "./ProfileSettings";
import type { Profile, Musician, SocialLinks } from "@/types/profile";
import { UseMutationResult } from "@tanstack/react-query";

interface ProfileViewProps {
  profile: Profile;
  musician: Musician | null;
  isOwner: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSocialLinksUpdate: (links: SocialLinks) => void;
  onBecomeMusicianClick: () => void;
  onMusicianProfileCreated: () => void;
  updateProfileMutation: UseMutationResult<void, Error, Partial<Profile>>;
}

export const ProfileView = ({
  profile,
  musician,
  isOwner,
  onImageUpload,
  onSocialLinksUpdate,
  onBecomeMusicianClick,
  onMusicianProfileCreated,
  updateProfileMutation
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
          <div className="mt-8">
            <ProfileSettings
              profile={profile}
              onUpdate={(updates) => updateProfileMutation.mutateAsync(updates)}
              isLoading={updateProfileMutation.isPending}
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