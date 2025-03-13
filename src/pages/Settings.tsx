// In your Settings.tsx component:

import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client"; // Make sure this is still imported if needed elsewhere in this component or remove if not
import { ThemeCustomization } from "@/components/profile/ThemeCustomization";
import { useProfileMutation } from "@/hooks/useProfileMutation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Profile } from "@/types/profile";
import { fetchProfileData } from "@/utils_folder/supabaseProfile"; // Import the isolated function


export const Settings = () => {
  const { user } = useAuth();
  const updateProfileMutation = useProfileMutation();

  const { data: profile, isLoading, error } } = useQuery({ // Capture the error from useQuery
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfileData(user?.id), // Use the isolated function
    enabled: !!user?.id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("useQuery error fetching profile:", error); // Log the error from useQuery as well
    return <div>Error loading profile. Please check the console for details.</div>;
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