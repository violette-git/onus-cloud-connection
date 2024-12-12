import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/Navbar";
import { Index } from "@/pages/Index";
import { Profile } from "@/pages/Profile";
import { Musicians } from "@/pages/Musicians";
import { MusicianProfile } from "@/pages/MusicianProfile";
import { Notifications } from "@/pages/Notifications";
import { Settings } from "@/pages/Settings";
import { Explore } from "@/pages/Explore";
import { Connections } from "@/pages/Connections";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <div className="min-h-screen">
              <Navbar />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/:id" element={<Profile />} />
                  <Route path="/musicians" element={<Musicians />} />
                  <Route path="/musicians/:id" element={<MusicianProfile />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/connections" element={<Connections />} />
                </Routes>
              </main>
            </div>
            <Toaster />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;