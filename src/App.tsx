import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Navbar } from "./components/Navbar";
import { Index } from "./pages/Index";
import { Profile } from "./pages/Profile";
import { MusicianProfile } from "./pages/MusicianProfile";
import { Musicians } from "./pages/Musicians";
import { Settings } from "./pages/Settings";
import { Notifications } from "./pages/Notifications";
import { Explore } from "./pages/Explore";
import { Connections } from "./components/profile/Connections";
import { useAuth } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

// Wrap the routes with auth check
const AuthenticatedRoutes = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/musicians/:id" element={<MusicianProfile />} />
          <Route path="/musicians" element={<Musicians />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/explore" element={<Explore />} />
          <Route 
            path="/connections" 
            element={user ? <Connections userId={user.id} /> : null} 
          />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <AuthenticatedRoutes />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;