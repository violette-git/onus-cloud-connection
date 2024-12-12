import { Button } from "@/components/ui/button";
import { Music2, Share2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ProfileHeader } from "./profile/ProfileHeader";
import { SocialLinksSection } from "./profile/SocialLinks";
import type { Profile as ProfileType, SocialLinks } from "@/types/profile";

const defaultSocialLinks: SocialLinks = {
  instagram: "",
  youtube: "",
  linkedin: ""
};

export const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        social_links: data.social_links || defaultSocialLinks
      } as ProfileType;
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<ProfileType>) => {
      if (!user?.id) throw new Error("No user");
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Success!",
        description: "Your profile has been updated.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update profile. Please try again.",
      });
      console.error('Error updating profile:', error);
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfileMutation.mutateAsync({ avatar_url: publicUrl });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not upload image. Please try again.",
      });
      console.error('Error uploading image:', error);
    }
  };

  const handleSocialLinksUpdate = async (newLinks: SocialLinks) => {
    try {
      await updateProfileMutation.mutateAsync({ social_links: newLinks });
    } catch (error) {
      console.error('Error updating social links:', error);
    }
  };

  const handleBecomeMusicianClick = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ role: 'musician' })
      .eq('id', user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not upgrade to musician account. Please try again.",
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Your account has been upgraded to a musician account.",
    });
  };

  if (!profile) return null;

  return (
    <div className="animate-fade-in">
      <ProfileHeader 
        profile={profile}
        isOwner={user?.id === profile.id}
        onImageUpload={handleImageUpload}
      />

      <div className="mt-20 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {profile.role === 'observer' ? (
            <Button onClick={handleBecomeMusicianClick}>
              <Music2 className="mr-2 h-4 w-4" />
              Become a Musician
            </Button>
          ) : (
            <>
              <Button className="gradient-border">
                <Music2 className="mr-2 h-4 w-4" />
                Follow
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </>
          )}
        </div>
        <SocialLinksSection
          initialLinks={profile.social_links || defaultSocialLinks}
          isOwner={user?.id === profile.id}
          onSave={handleSocialLinksUpdate}
        />
      </div>

      {profile.role === 'musician' && (
        <div className="mt-12 px-8">
          {musician ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-card p-6 border hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Music2 className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Complete Your Musician Profile</h2>
              <p className="text-muted-foreground mb-4">
                Set up your musician profile to start sharing your music
              </p>
              <Button>
                Create Musician Profile
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
