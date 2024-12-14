import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paintbrush } from "lucide-react";
import type { Profile } from "@/types/profile";

interface ThemeCustomizationProps {
  profile: Profile;
  onThemeUpdate: (colors: { primary: string; secondary: string; accent: string }) => void;
  onBannerUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ThemeCustomization = ({ 
  profile,
  onThemeUpdate,
  onBannerUpload 
}: ThemeCustomizationProps) => {
  const [colors, setColors] = useState({
    primary: profile.theme_colors?.primary || "#6B46C1",
    secondary: profile.theme_colors?.secondary || "#4299E1",
    accent: profile.theme_colors?.accent || "#ED64A6"
  });

  const handleColorChange = (key: keyof typeof colors) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColors = { ...colors, [key]: e.target.value };
    setColors(newColors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onThemeUpdate(colors);
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Paintbrush className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Customize Theme</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="primary">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="primary"
                  value={colors.primary}
                  onChange={handleColorChange("primary")}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={colors.primary}
                  onChange={handleColorChange("primary")}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="secondary">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="secondary"
                  value={colors.secondary}
                  onChange={handleColorChange("secondary")}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={colors.secondary}
                  onChange={handleColorChange("secondary")}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="accent">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="accent"
                  value={colors.accent}
                  onChange={handleColorChange("accent")}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={colors.accent}
                  onChange={handleColorChange("accent")}
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner">Profile Banner</Label>
            <Input
              type="file"
              id="banner"
              accept="image/*"
              onChange={onBannerUpload}
              className="cursor-pointer"
            />
          </div>

          <Button type="submit">Save Theme</Button>
        </form>
      </CardContent>
    </Card>
  );
};