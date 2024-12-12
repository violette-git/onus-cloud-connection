import { useAuth } from "@/contexts/AuthContext";
import { NudgeList } from "@/components/messaging/NudgeList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold gradient-text text-center">
            Welcome to Onus
          </h1>
          <p className="text-xl text-muted-foreground text-center">
            Connect with musicians, share your music, and grow your audience.
          </p>

          {user && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <NudgeList />
              </CardContent>
            </Card>
          )}

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