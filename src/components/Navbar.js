import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
import { useState } from "react";
import { NavLinks } from "./navbar/NavLinks";
import { AuthButtons } from "./navbar/AuthButtons";
import { useAuth } from "@/contexts/AuthContext";
export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const handleSheetOpenChange = (open) => {
        setIsOpen(open);
    };
    return (_jsx("nav", { className: "fixed top-0 left-0 right-0 w-screen bg-background/95 backdrop-blur-sm border-b border-border/40 z-50", children: _jsxs("div", { className: "onus-container h-16 flex items-center justify-between", children: [_jsx(Link, { to: "/", className: "flex items-center", children: _jsx("span", { className: "text-2xl font-bold gradient-text", children: "ONUS" }) }), _jsx("div", { className: "hidden md:flex items-center gap-8", children: _jsx(NavLinks, {}) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex items-center", children: _jsx(AuthButtons, {}) }), _jsxs(Sheet, { open: isOpen, onOpenChange: handleSheetOpenChange, children: [_jsx(SheetTrigger, { asChild: true, className: "md:hidden", children: _jsx(Button, { variant: "ghost", size: "icon", className: "h-9 w-9 p-0", children: isOpen ? _jsx(X, { className: "h-5 w-5" }) : _jsx(Menu, { className: "h-5 w-5" }) }) }), _jsxs(SheetContent, { side: "right", className: "w-[280px] flex flex-col", children: [_jsx(SheetHeader, { children: _jsx(SheetTitle, { children: "Menu" }) }), _jsxs("div", { className: "flex flex-col space-y-4 mt-8", children: [_jsx(NavLinks, { onNavigate: () => setIsOpen(false) }), user && (_jsx(Link, { to: "/messages", className: "text-muted-foreground hover:text-foreground transition-colors", onClick: () => setIsOpen(false), children: "Messages" }))] })] })] })] })] }) }));
};
