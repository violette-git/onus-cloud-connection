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
      <main className="pt-16">
        <div className="onus-container">
          <ConnectionsComponent userId={user.id} />
        </div>
      </main>
    </div>
  );
};