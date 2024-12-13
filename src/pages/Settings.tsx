import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, MessageSquareOff } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CommentPreferences, ThemeColors } from "@/types/database";
import { ensureCommentPreferences, ensureThemeColors } from "@/types/database";
import { ThemeCustomization } from "@/components/profile/ThemeCustomization";
import { useProfileMutation } from "@/hooks/useProfileMutation";
import type { Profile } from "@/types/profile";

export const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateProfileMutation = useProfileMutation();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        comment_preferences: ensureCommentPreferences(data.comment_preferences),
        theme_colors: ensureThemeColors(data.theme_colors)
      } as Profile;
    },
    enabled: !!user?.id,
  });

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-banner-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfileMutation.mutateAsync({ 
        id: user.id,
        banner_url: publicUrl 
      });
    } catch (error) {
      console.error('Error uploading banner:', error);
    }
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const disableComments = profile?.comment_preferences?.disable_comments ?? false;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>
          <div className="space-y-6">
            <div className="p-6 rounded-lg border bg-card">
              <h2 className="text-xl font-semibold mb-4">Appearance</h2>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-5 w-5" />
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                  />
                  <Moon className="h-5 w-5" />
                </div>
              </div>
            </div>

            {profile && (
              <ThemeCustomization
                profile={profile}
                onThemeUpdate={(colors: ThemeColors) => updateProfileMutation.mutateAsync({ 
                  id: profile.id,
                  theme_colors: colors 
                })}
                onBannerUpload={handleBannerUpload}
              />
            )}

            <div className="p-6 rounded-lg border bg-card">
              <h2 className="text-xl font-semibold mb-4">Comment Settings</h2>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Disable Comments</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn off comments on all your content
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={disableComments}
                    onCheckedChange={(checked) => updateProfileMutation.mutateAsync({
                      id: profile!.id,
                      comment_preferences: { disable_comments: checked }
                    })}
                  />
                  <MessageSquareOff className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
