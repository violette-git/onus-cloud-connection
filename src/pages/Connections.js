import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navbar } from "@/components/Navbar";
import { Connections as ConnectionsComponent } from "@/components/profile/Connections";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
export const Connections = () => {
    const { user } = useAuth();
    if (!user) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx(Navbar, {}), _jsx("main", { className: "pt-16", children: _jsx("div", { className: "onus-container", children: _jsx(ConnectionsComponent, { userId: user.id }) }) })] }));
};
