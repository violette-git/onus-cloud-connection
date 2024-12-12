import { Button } from "@/components/ui/button";
import { 
  Instagram, 
  Linkedin, 
  Music2, 
  Share2, 
  Youtube 
} from "lucide-react";

export const Profile = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-onus-purple/20 via-onus-blue/20 to-onus-pink/20">
        <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
          <div className="gradient-border">
            <img
              src="https://source.unsplash.com/300x300/?musician"
              alt="Profile"
              className="w-32 h-32 rounded-lg object-cover"
            />
          </div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold">John Doe</h1>
            <p className="text-muted-foreground">Musician & Producer</p>
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="mt-20 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button className="gradient-border">
            <Music2 className="mr-2 h-4 w-4" />
            Follow
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
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
      <div className="mt-12 px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
};