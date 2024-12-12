import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type Musician = Database['public']['Tables']['musicians']['Row'];
type Genre = Database['public']['Tables']['genres']['Row'];

interface MusicianWithGenres extends Musician {
  musician_genres: {
    genre: Pick<Genre, 'name'>;
  }[];
}

const Musicians = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: userProfile } = useQuery({
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

  const { data: genres, isLoading: isLoadingGenres } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: musicians, isLoading: isLoadingMusicians } = useQuery<MusicianWithGenres[]>({
    queryKey: ['musicians', searchQuery, selectedGenre],
    queryFn: async () => {
      let query = supabase
        .from('musicians')
        .select(`
          *,
          musician_genres (
            genre:genres (
              name
            )
          )
        `);

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (selectedGenre && selectedGenre !== 'all') {
        query = query.eq('musician_genres.genre_id', selectedGenre);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as MusicianWithGenres[];
    },
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

  const getGenreNames = (musician: MusicianWithGenres) => {
    return musician.musician_genres
      .map(mg => mg.genre.name)
      .join(', ');
  };

  const isLoading = isLoadingGenres || isLoadingMusicians;

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {user && userProfile?.role === 'observer' && (
          <div className="bg-muted p-4 rounded-lg text-center space-y-2">
            <p className="text-muted-foreground">Want to share your music with the world?</p>
            <Button onClick={handleBecomeMusicianClick}>
              Become a Musician
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search musicians..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={selectedGenre}
            onValueChange={setSelectedGenre}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres?.map((genre) => (
                <SelectItem key={genre.id} value={genre.id}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading musicians...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {musicians?.map((musician) => (
              <Card key={musician.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted">
                    {musician.avatar_url && (
                      <img 
                        src={musician.avatar_url} 
                        alt={musician.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </CardContent>
                <CardHeader>
                  <CardTitle className="text-lg">{musician.name}</CardTitle>
                  <CardDescription>
                    {getGenreNames(musician)} • {musician.location || 'Unknown location'}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
            
            {musicians?.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground">
                No musicians found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Musicians;