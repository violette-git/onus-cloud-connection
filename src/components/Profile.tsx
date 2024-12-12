import { Button } from "@/components/ui/button";
import { 
  Instagram, 
  Linkedin, 
  Music2, 
  Share2, 
  Youtube 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();

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
          <div className="gradient-border">
            <img
              src={profile?.avatar_url || "https://source.unsplash.com/300x300/?musician"}
              alt="Profile"
              className="w-32 h-32 rounded-lg object-cover"
            />
          </div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold">{profile?.full_name || "Anonymous User"}</h1>
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
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Youtube className="h-5 w-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin className="h-5 w-5" />
          </a>
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