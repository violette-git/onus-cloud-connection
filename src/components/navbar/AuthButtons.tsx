import { User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthForm } from "../auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

interface AuthButtonsProps {
  onAction?: () => void;
}

export const AuthButtons = ({ onAction }: AuthButtonsProps) => {
  const { user, signOut } = useAuth();

  return (
    <>
      {user ? (
        <>
          <Link 
            to="/profile" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={onAction}
          >
            <User className="h-5 w-5" />
          </Link>
          <Button variant="outline" onClick={() => {
            signOut();
            onAction?.();
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
};