import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/Navbar";
import { Index } from "@/pages/Index";
import { Explore } from "@/pages/Explore";
import { Musicians } from "@/pages/Musicians";
import { MusicianProfile } from "@/pages/MusicianProfile";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";
import { Notifications } from "@/pages/Notifications";
import { Connections } from "@/pages/Connections";
import { Messages } from "@/pages/Messages";

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/musicians" element={<Musicians />} />
                <Route path="/musician/:id" element={<MusicianProfile />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/messages" element={<Messages />} />
              </Routes>
              <Toaster />
            </div>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
