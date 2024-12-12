import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import { Index } from "./pages/Index";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { Musicians } from "./pages/Musicians";
import { MusicianProfile } from "./pages/MusicianProfile";
import { Explore } from "./pages/Explore";
import { Notifications } from "./pages/Notifications";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/musicians" element={<Musicians />} />
              <Route path="/musicians/:id" element={<MusicianProfile />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;