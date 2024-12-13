import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import type { Profile, Musician } from "@/types/profile";

interface ProfileHeaderProps {
  profile: Profile;
  musician?: Musician | null;
  isOwner: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader = ({ profile, musician, isOwner, onImageUpload }: ProfileHeaderProps) => {
  const displayName = musician?.name || profile?.full_name || profile?.username || "Anonymous User";
  const role = profile?.role === 'musician' ? 'Musician' : 'Music Enthusiast';
  
  const headerStyle = profile.banner_url ? {
    backgroundImage: `url(${profile.banner_url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {
    background: `linear-gradient(to right, ${profile.theme_colors?.primary || '#6B46C1'}33, ${profile.theme_colors?.secondary || '#4299E1'}33)`
  };
  
  return (
    <div className="relative">
      <div className="h-48 transition-all duration-300" style={headerStyle} />
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-24">
        <div className="flex flex-col items-center space-y-4">
          <div className="gradient-border relative group">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-40 h-40 rounded-lg object-cover bg-background"
              />
            ) : (
              <div className="w-40 h-40 rounded-lg bg-muted flex items-center justify-center">
                <User className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            {isOwner && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageUpload}
                />
                <User className="h-8 w-8 text-white" />
              </label>
            )}
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold">{displayName}</h1>
            <p className="text-muted-foreground mt-1" style={{ color: profile.theme_colors?.accent }}>
              {role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};