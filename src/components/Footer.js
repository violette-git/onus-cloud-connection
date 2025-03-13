import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
export const Footer = () => {
    const [email, setEmail] = useState("");
    const { toast } = useToast();
    const handleNewsletterSignup = (e) => {
        e.preventDefault();
        // Here you would typically handle the newsletter signup
        toast({
            title: "Thanks for subscribing!",
            description: "You'll receive our newsletter updates soon.",
        });
        setEmail("");
    };
    return (_jsx("footer", { className: "bg-background border-t border-border/40 mt-12", children: _jsxs("div", { className: "onus-container py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsx(Link, { to: "/", className: "flex items-center", children: _jsx("span", { className: "text-2xl font-bold gradient-text", children: "ONUS" }) }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Connect with musicians, share your music, and grow your audience." })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-4", children: "Navigation" }), _jsxs("ul", { className: "space-y-2", children: [_jsx("li", { children: _jsx(Link, { to: "/explore", className: "text-sm text-muted-foreground hover:text-foreground transition-colors", children: "Explore" }) }), _jsx("li", { children: _jsx(Link, { to: "/musicians", className: "text-sm text-muted-foreground hover:text-foreground transition-colors", children: "Musicians" }) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-4", children: "About & Contact" }), _jsxs("ul", { className: "space-y-2", children: [_jsx("li", { children: _jsx(Link, { to: "/about", className: "text-sm text-muted-foreground hover:text-foreground transition-colors", children: "About Us" }) }), _jsx("li", { children: _jsx(Link, { to: "/contact", className: "text-sm text-muted-foreground hover:text-foreground transition-colors", children: "Contact" }) }), _jsx("li", { children: _jsx("a", { href: "mailto:support@onus.com", className: "text-sm text-muted-foreground hover:text-foreground transition-colors", children: "Support" }) }), _jsx("li", { children: _jsx(Link, { to: "/feedback", className: "text-sm text-muted-foreground hover:text-foreground transition-colors", children: "Feedback" }) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-4", children: "Newsletter" }), _jsxs("form", { onSubmit: handleNewsletterSignup, className: "space-y-2", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { type: "email", placeholder: "Enter your email", value: email, onChange: (e) => setEmail(e.target.value), className: "text-sm", required: true }), _jsx(Button, { type: "submit", size: "sm", className: "shrink-0", children: _jsx(Send, { className: "h-4 w-4" }) })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Stay updated with our latest features and updates." })] })] })] }), _jsx("div", { className: "border-t border-border/40 mt-6 py-3 text-center", children: _jsxs("p", { className: "text-sm text-muted-foreground", children: ["\u00A9 ", new Date().getFullYear(), " ONUS. All rights reserved."] }) })] }) }));
};
