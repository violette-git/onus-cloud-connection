import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MusicianHeader } from "@/components/profile/musician/MusicianHeader";
import { MusicianContent } from "@/components/profile/musician/MusicianContent";
import { MusicianAbout } from "@/components/profile/musician/MusicianAbout";
import { CollaborationRequests } from "@/components/profile/CollaborationRequests";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { FeaturedContent } from "@/components/profile/FeaturedContent";
import { useToast } from "@/hooks/use-toast";

export const MusicianProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: musician, isLoading, error } = useQuery({
    queryKey: ['musician', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('musicians')
        .select(`
          *,
          profile:profiles!musicians_user_id_fkey (
            avatar_url,
            username,
            full_name
          ),
          musician_genres (
            genre: genres (name)
          ),
          songs (
            id,
            title,
            url,
            created_at,
            updated_at
          ),
          videos (
            id,
            title,
            url,
            platform,
            created_at,
            updated_at
          )
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching musician:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Musician not found');
      }
      
      return data;
    },
    meta: {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "This musician profile doesn't exist or has been removed.",
        });
        navigate('/musicians');
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading musician profile...</p>
        </div>
      </div>
    );
  }

  if (!musician) return null;

  const isOwner = user?.id === musician.user_id;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient Background */}
      <div className="h-[280px] bg-gradient-to-br from-onus-purple/20 via-onus-blue/20 to-onus-pink/20">
        <div className="container mx-auto px-4 pt-8">
          <BackButton />
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Profile Header Section */}
        <div className="-mt-24 mb-12">
          <MusicianHeader musician={musician} />
        </div>

        {/* Featured Content Section */}
        <div className="mb-8">
          <FeaturedContent
            musicianId={musician.id}
            isOwner={isOwner}
            songs={musician.songs || []}
            videos={musician.videos || []}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {isOwner && (
              <Card>
                <CardContent className="p-6">
                  <CollaborationRequests musicianId={musician.id} />
                </CardContent>
              </Card>
            )}

            <MusicianContent 
              musician={musician}
              isOwner={isOwner}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <MusicianAbout musician={musician} />
          </div>
        </div>
      </div>
    </div>
  );
};