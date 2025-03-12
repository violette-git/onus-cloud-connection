import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface NavLinksProps {
  onNavigate?: () => void;
}

export const NavLinks = ({ onNavigate }: NavLinksProps) => {
  const { user } = useAuth();

  return (
    <>
      <Link 
        to="/explore" 
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={onNavigate}
      >
        Explore
      </Link>
      <Link 
        to="/musicians" 
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={onNavigate}
      >
        Musicians
      </Link>
      <Link
        to="/forum"
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={onNavigate}
      >
        Forum
      </Link>
      {user && (
        <Link 
          to="/connections" 
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={onNavigate}
        >
          Connections
        </Link>
      )}
    </>
  );
};
