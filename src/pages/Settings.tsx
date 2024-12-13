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
import { CommentPreferences } from "@/types/database";

export const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('comment_preferences')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (disableComments: boolean) => {
      if (!user?.id) throw new Error("No user");
      const { error } = await supabase
        .from('profiles')
        .update({
          comment_preferences: { disable_comments: disableComments }
        })
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Success",
        description: "Your comment preferences have been updated.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update preferences. Please try again.",
      });
      console.error('Error updating preferences:', error);
    },
  });

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const disableComments = (profile?.comment_preferences as CommentPreferences)?.disable_comments ?? false;

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
                    onCheckedChange={(checked) => updatePreferencesMutation.mutate(checked)}
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
