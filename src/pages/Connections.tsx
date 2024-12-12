import { Navbar } from "@/components/Navbar";
import { Connections as ConnectionsComponent } from "@/components/profile/Connections";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export const Connections = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-16">
        <ConnectionsComponent userId={user.id} />
      </main>
    </div>
  );
};