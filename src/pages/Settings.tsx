import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ThemeCustomization } from "@/components/profile/ThemeCustomization";
import { useProfileMutation } from "@/hooks/useProfileMutation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Profile } from "@/types/profile";

export const Settings = () => {
  const { user } = useAuth();
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
      return data as Profile;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme Customization</CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeCustomization
              profile={profile}
              onUpdate={(colors) => 
                updateProfileMutation.mutateAsync({ 
                  id: profile.id, 
                  theme_colors: colors 
                })
              }
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Add more settings sections here */}
      </div>
    </div>
  );
};