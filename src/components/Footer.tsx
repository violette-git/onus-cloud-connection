import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the newsletter signup
    toast({
      title: "Thanks for subscribing!",
      description: "You'll receive our newsletter updates soon.",
    });
    setEmail("");
  };

  return (
    <footer className="bg-background border-t border-border/40 mt-12">
      <div className="onus-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold gradient-text">ONUS</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connect with musicians, share your music, and grow your audience.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/musicians" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Musicians
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Contact */}
          <div>
            <h3 className="font-semibold mb-4">About & Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="mailto:support@onus.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </a>
              </li>
              <li>
                <Link to="/feedback" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <form onSubmit={handleNewsletterSignup} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm"
                  required
                />
                <Button type="submit" size="sm" className="shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Stay updated with our latest features and updates.
              </p>
            </form>
          </div>
        </div>

        {/* Copyright - Centered between content and bottom */}
        <div className="border-t border-border/40 mt-6 py-3 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ONUS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};