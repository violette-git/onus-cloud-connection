import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Instagram, 
  Linkedin, 
  Music2, 
  Share2, 
  Youtube,
  Upload
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    youtube: "",
    linkedin: ""
  });

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
      if (data.social_links) {
        setSocialLinks(data.social_links);
      }
      return data;
    },
    enabled: !!user,
  });

  const { data: musician } = useQuery({
    queryKey: ['musician', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('musicians')
        .select(`
          *,
          musician_genres (
            genre: genres (name)
          )
        `)
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user && profile?.role === 'musician',
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { avatar_url?: string, social_links?: any }) => {
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

  const handleSocialLinksSubmit = async () => {
    try {
      await updateProfileMutation.mutateAsync({ social_links: socialLinks });
      setIsEditingLinks(false);
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

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-onus-purple/20 via-onus-blue/20 to-onus-pink/20">
        <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
          <div className="gradient-border relative group">
            <img
              src={profile?.avatar_url || "https://source.unsplash.com/300x300/?musician"}
              alt="Profile"
              className="w-32 h-32 rounded-lg object-cover"
            />
            {user?.id === profile?.id && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
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

      {/* Profile Actions */}
      <div className="mt-20 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {profile?.role === 'observer' ? (
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
        <div className="flex items-center space-x-4">
          {isEditingLinks ? (
            <div className="flex items-center gap-4">
              <Input
                placeholder="Instagram URL"
                value={socialLinks.instagram}
                onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                className="w-48"
              />
              <Input
                placeholder="YouTube URL"
                value={socialLinks.youtube}
                onChange={(e) => setSocialLinks(prev => ({ ...prev, youtube: e.target.value }))}
                className="w-48"
              />
              <Input
                placeholder="LinkedIn URL"
                value={socialLinks.linkedin}
                onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                className="w-48"
              />
              <Button onClick={handleSocialLinksSubmit}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditingLinks(false)}>Cancel</Button>
            </div>
          ) : (
            <>
              {user?.id === profile?.id && (
                <Button variant="outline" onClick={() => setIsEditingLinks(true)}>
                  Edit Links
                </Button>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content Grid */}
      {profile?.role === 'musician' && (
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