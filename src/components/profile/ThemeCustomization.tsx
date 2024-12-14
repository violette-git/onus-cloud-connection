import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Profile } from "@/types/profile";

export interface ThemeCustomizationProps {
  profile: Profile;
  onUpdate: (colors: Profile['theme_colors']) => Promise<void>;
}

export const ThemeCustomization = ({ profile, onUpdate }: ThemeCustomizationProps) => {
  const [colors, setColors] = useState(profile.theme_colors);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await onUpdate(colors);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="primary" className="block text-sm font-medium mb-1">
          Primary Color
        </label>
        <Input
          id="primary"
          type="color"
          value={colors.primary}
          onChange={(e) => setColors({ ...colors, primary: e.target.value })}
          className="h-10 w-full"
        />
      </div>

      <div>
        <label htmlFor="secondary" className="block text-sm font-medium mb-1">
          Secondary Color
        </label>
        <Input
          id="secondary"
          type="color"
          value={colors.secondary}
          onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
          className="h-10 w-full"
        />
      </div>

      <div>
        <label htmlFor="accent" className="block text-sm font-medium mb-1">
          Accent Color
        </label>
        <Input
          id="accent"
          type="color"
          value={colors.accent}
          onChange={(e) => setColors({ ...colors, accent: e.target.value })}
          className="h-10 w-full"
        />
      </div>

      <Button type="submit" disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update Colors"}
      </Button>
    </form>
  );
};