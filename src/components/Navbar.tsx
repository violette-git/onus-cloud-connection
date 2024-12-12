import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { NavLinks } from "./navbar/NavLinks";
import { AuthButtons } from "./navbar/AuthButtons";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const handleSheetOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-screen bg-background/95 backdrop-blur-sm border-b border-border/40 z-50">
      <div className="w-full max-w-screen-xl mx-auto h-16 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold gradient-text">ONUS</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLinks />
        </div>

        <div className="flex items-center gap-4">
          {/* Auth Buttons */}
          <div className="flex items-center">
            <AuthButtons />
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] flex flex-col">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                <NavLinks onNavigate={() => setIsOpen(false)} />
                {user && (
                  <Link 
                    to="/messages" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Messages
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};