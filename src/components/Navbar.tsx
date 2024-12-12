import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "./auth/AuthForm";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link 
        to="/explore" 
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Explore
      </Link>
      <Link 
        to="/musicians" 
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setIsOpen(false)}
      >
        Musicians
      </Link>
    </>
  );

  const AuthButtons = () => (
    <>
      {user ? (
        <>
          <Link 
            to="/profile" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-5 w-5" />
          </Link>
          <Button variant="outline" onClick={() => {
            signOut();
            setIsOpen(false);
          }}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full md:w-auto">
              Sign In
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <AuthForm />
          </DialogContent>
        </Dialog>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold gradient-text">Onus</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLinks />
          <AuthButtons />
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[385px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4 mt-8">
              <NavLinks />
              <div className="pt-4">
                <AuthButtons />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};