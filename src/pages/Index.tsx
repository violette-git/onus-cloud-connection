import { useAuth } from "@/contexts/AuthContext";
import { LinkSunoAccount } from "@/components/suno/LinkSunoAccount";

export const Index = () => {
  const { user } = useAuth();
  const isSigningUp = new URLSearchParams(window.location.search).get('signup') === 'true';

  // Only show linking component if user is signing up
  if (user && isSigningUp) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="onus-container">
          <LinkSunoAccount />
        </div>
      </div>
    );
  }

  // Regular landing page content
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="onus-container">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Onus
        </h1>
        <p className="text-center text-lg text-gray-600">
          Connect with musicians and create amazing music together
        </p>
      </div>
    </div>
  );
};