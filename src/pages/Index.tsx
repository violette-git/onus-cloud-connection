import { useAuth } from "@/contexts/AuthContext";
import { LinkSunoAccount } from "@/components/suno/LinkSunoAccount";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Index = () => {
  const { user } = useAuth();
  const isSigningUp = new URLSearchParams(window.location.search).get('signup') === 'true';

  // Only show linking component if user is signing up
  if (isSigningUp) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="onus-container">
          <LinkSunoAccount />
        </div>
      </div>
    );
  }

  // Regular landing page content
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="onus-container">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-onus-purple via-onus-blue to-onus-pink bg-clip-text text-transparent">
              Welcome to Onus
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with musicians, share your music, and grow your audience. Join our community of passionate artists and creators.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/explore">
                <Button size="lg" variant="default">
                  Explore Music
                </Button>
              </Link>
              {!user && (
                <Link to="/?signup=true">
                  <Button size="lg" variant="outline">
                    Join Now
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 py-12">
            <div className="space-y-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <h3 className="text-xl font-semibold">Connect</h3>
              <p className="text-muted-foreground">
                Find and collaborate with musicians who share your passion and vision.
              </p>
            </div>
            <div className="space-y-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <h3 className="text-xl font-semibold">Create</h3>
              <p className="text-muted-foreground">
                Use AI-powered tools to compose, arrange, and produce your music.
              </p>
            </div>
            <div className="space-y-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <h3 className="text-xl font-semibold">Share</h3>
              <p className="text-muted-foreground">
                Showcase your work and get feedback from the community.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-12 space-y-6">
            <h2 className="text-3xl font-bold">Ready to make music?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join our growing community of musicians and start creating today.
            </p>
            {!user && (
              <Link to="/?signup=true">
                <Button size="lg" className="bg-onus-purple hover:bg-onus-purple/90">
                  Get Started
                </Button>
              </Link>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};