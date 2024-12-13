import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/types/profile";

interface ProfileSettingsProps {
  profile: Profile;
  onUpdate: (updates: Partial<Profile>) => void;
  isLoading?: boolean;
}

export const ProfileSettings = ({ profile, onUpdate, isLoading }: ProfileSettingsProps) => {
  const [handle, setHandle] = useState(profile.handle || '');
  const [visibility, setVisibility] = useState(profile.visibility || 'public');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      id: profile.id,
      handle: handle || null,
      visibility
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Customize your profile URL and privacy settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="handle">Profile Handle</Label>
            <Input
              id="handle"
              placeholder="your-unique-handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              This will be your unique URL: /profile/{handle || '[handle]'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Profile Visibility</Label>
            <Select
              value={visibility}
              onValueChange={setVisibility}
            >
              <SelectTrigger id="visibility">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="followers">Followers Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isLoading}>
            Save Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};