import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import type { Profile, Musician } from "@/types/profile";

interface ProfileHeaderProps {
  profile: Profile;
  musician?: Musician | null;
  isOwner: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader = ({ profile, musician, isOwner, onImageUpload }: ProfileHeaderProps) => {
  const displayName = musician?.name || profile?.full_name || profile?.username || "User";
  
  return (
    <div className="relative">
      <div className="h-48 bg-gradient-to-r from-onus-purple/20 via-onus-blue/20 to-onus-pink/20" />
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="gradient-border relative group">
            <img
              src={profile?.avatar_url || "https://source.unsplash.com/300x300/?musician"}
              alt={displayName}
              className="w-32 h-32 rounded-lg object-cover bg-background"
            />
            {isOwner && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageUpload}
                />
                <Upload className="h-6 w-6 text-white" />
              </label>
            )}
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold">{displayName}</h1>
            <p className="text-muted-foreground">
              {profile?.role === 'musician' ? 'Musician' : 'Music Enthusiast'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};