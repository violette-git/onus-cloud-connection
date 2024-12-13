import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useProfileMutation } from "@/hooks/useProfileMutation";
import { ThemeCustomization } from "@/components/profile/ThemeCustomization";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ensureCommentPreferences, ensureSocialLinks, ensureThemeColors } from "@/types/database";
import type { Profile } from "@/types/profile";

export const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const updateProfileMutation = useProfileMutation();

  const { data: profile, isLoading } = useQuery({
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
        social_links: ensureSocialLinks(data.social_links),
        comment_preferences: ensureCommentPreferences(data.comment_preferences),
        theme_colors: ensureThemeColors(data.theme_colors)
      } as Profile;
    },
    enabled: !!user?.id,
  });

  if (isLoading || !profile) {
    return <div>Loading settings...</div>;
  }

  const handleVisibilityChange = async (isPublic: boolean) => {
    try {
      await updateProfileMutation.mutateAsync({
        id: profile.id,
        visibility: isPublic ? 'public' : 'private'
      });
      
      toast({
        title: "Success",
        description: `Your profile is now ${isPublic ? 'public' : 'private'}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile visibility",
      });
    }
  };

  const handleCommentsChange = async (allowComments: boolean) => {
    try {
      await updateProfileMutation.mutateAsync({
        id: profile.id,
        comment_preferences: { disable_comments: !allowComments }
      });
      
      toast({
        title: "Success",
        description: `Comments are now ${allowComments ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update comment preferences",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Profile Visibility</Label>
                  <div className="text-sm text-muted-foreground">
                    Make your profile visible to everyone
                  </div>
                </div>
                <Switch
                  checked={profile.visibility === 'public'}
                  onCheckedChange={handleVisibilityChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Comments</Label>
                  <div className="text-sm text-muted-foreground">
                    Let others comment on your content
                  </div>
                </div>
                <Switch
                  checked={!profile.comment_preferences.disable_comments}
                  onCheckedChange={handleCommentsChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
            <ThemeCustomization
              initialColors={profile.theme_colors}
              onUpdate={(colors) => 
                updateProfileMutation.mutateAsync({
                  id: profile.id,
                  theme_colors: colors
                })
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};