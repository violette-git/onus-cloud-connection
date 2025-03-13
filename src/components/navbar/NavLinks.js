import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
export const NavLinks = ({ onNavigate }) => {
    const { user } = useAuth();
    return (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/explore", className: "text-muted-foreground hover:text-foreground transition-colors", onClick: onNavigate, children: "Explore" }), _jsx(Link, { to: "/musicians", className: "text-muted-foreground hover:text-foreground transition-colors", onClick: onNavigate, children: "Musicians" }), _jsx(Link, { to: "/forum", className: "text-muted-foreground hover:text-foreground transition-colors", onClick: onNavigate, children: "Forum" }), user && (_jsx(Link, { to: "/connections", className: "text-muted-foreground hover:text-foreground transition-colors", onClick: onNavigate, children: "Connections" }))] }));
};
