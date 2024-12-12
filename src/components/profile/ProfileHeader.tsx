import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import type { Profile } from "@/types/profile";

interface ProfileHeaderProps {
  profile: Profile;
  isOwner: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader = ({ profile, isOwner, onImageUpload }: ProfileHeaderProps) => {
  return (
    <div className="relative h-64 bg-gradient-to-r from-onus-purple/20 via-onus-blue/20 to-onus-pink/20">
      <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
        <div className="gradient-border relative group">
          <img
            src={profile?.avatar_url || "https://source.unsplash.com/300x300/?musician"}
            alt="Profile"
            className="w-32 h-32 rounded-lg object-cover"
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
        <div className="mb-4">
          <h1 className="text-3xl font-bold">{profile?.username || "Anonymous User"}</h1>
          <p className="text-muted-foreground">
            {profile?.role === 'musician' ? 'Musician' : 'Music Enthusiast'}
          </p>
        </div>
      </div>
    </div>
  );
};