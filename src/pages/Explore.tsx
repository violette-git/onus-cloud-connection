import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Explore = () => {
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search for music, artists, or genres..." 
            className="pl-10"
          />
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Trending Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">Trending Artist {i}</CardTitle>
                  <CardDescription>Genre • 1.2M followers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Popular Genres</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['Rock', 'Jazz', 'Classical', 'Electronic'].map((genre) => (
              <Card key={genre} className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{genre}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Explore;