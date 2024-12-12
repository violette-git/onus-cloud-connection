import { Navbar } from "@/components/Navbar";

export const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold gradient-text">
            Welcome to Onus
          </h1>
          <p className="text-xl text-muted-foreground">
            Connect with musicians, share your music, and grow your audience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-muted-foreground">
                Find new artists and music that matches your taste
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-muted-foreground">
                Build meaningful connections with other musicians
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-2">Grow</h3>
              <p className="text-muted-foreground">
                Expand your audience and reach new listeners
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
