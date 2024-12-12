import { Link } from "react-router-dom";

interface NavLinksProps {
  onNavigate?: () => void;
}

export const NavLinks = ({ onNavigate }: NavLinksProps) => (
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
  </>
);