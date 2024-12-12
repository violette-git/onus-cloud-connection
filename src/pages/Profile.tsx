import { Navbar } from "@/components/Navbar";
import { Profile as ProfileComponent } from "@/components/Profile";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <ProfileComponent />
      </main>
    </div>
  );
};
