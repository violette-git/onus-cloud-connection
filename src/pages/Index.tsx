import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Music2, Users2, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <main className="w-full mx-auto px-4">
        <div className="max-w-[calc(100vw-32rem)] mx-auto space-y-16">
          {/* Hero Content */}
          <div className="max-w-4xl mx-auto space-y-8 text-center animate-fade-in pt-24">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">
              Connect with AI Musicians and Create Together
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Join the first social platform dedicated to AI musicians, collaborations, and creative growth
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={user ? "/explore" : "/musicians"}>
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/musicians">
                <Button size="lg" variant="secondary">
                  Discover AI Musicians
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in [animation-delay:200ms]">
            <div className="p-8 rounded-lg border bg-card hover:scale-105 transition-transform duration-300">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Music2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Share AI-Generated Music</h3>
              <p className="text-muted-foreground">
                Showcase your AI-generated compositions and connect with other AI musicians pushing the boundaries of creativity
              </p>
            </div>
            
            <div className="p-8 rounded-lg border bg-card hover:scale-105 transition-transform duration-300">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Users2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">AI Collaborations</h3>
              <p className="text-muted-foreground">
                Find and connect with other AI musicians, collaborate on innovative projects, and explore new creative possibilities
              </p>
            </div>
            
            <div className="p-8 rounded-lg border bg-card hover:scale-105 transition-transform duration-300">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Grow Your AI Music</h3>
              <p className="text-muted-foreground">
                Build your audience within the AI music community and get discovered by other innovative creators
              </p>
            </div>
          </div>

          {/* Why Onus Section */}
          <div className="max-w-4xl mx-auto space-y-12 py-16 animate-fade-in [animation-delay:400ms]">
            <h2 className="text-3xl md:text-4xl font-bold text-center gradient-text mb-12">
              Why Choose Onus?
            </h2>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-semibold">AI-First Platform</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Built specifically for AI musicians to showcase their work, connect with others, and push the boundaries of AI-generated music
                  </p>
                </div>
                <div className="flex-1 h-64 bg-gradient-to-r from-onus-purple via-onus-blue to-onus-pink rounded-lg" />
              </div>

              <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <Users2 className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-semibold">AI Music Community</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Join a thriving community of AI musicians, creators, and innovators all working together to define the future of music
                  </p>
                </div>
                <div className="flex-1 h-64 bg-gradient-to-l from-onus-purple via-onus-blue to-onus-pink rounded-lg" />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative overflow-hidden rounded-lg border bg-card p-12 animate-fade-in [animation-delay:600ms]">
            <div className="absolute inset-0 bg-gradient-to-r from-onus-purple/10 via-onus-blue/10 to-onus-pink/10" />
            <div className="relative z-10 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                Ready to Join the AI Music Revolution?
              </h2>
              <p className="text-xl text-muted-foreground">
                Connect with other AI musicians and start creating together
              </p>
              <Link to={user ? "/explore" : "/musicians"}>
                <Button size="lg" className="mt-4">
                  Get Started Now
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};