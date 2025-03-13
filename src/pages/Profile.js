import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navbar } from "@/components/Navbar";
import { Profile as ProfileComponent } from "@/components/Profile";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
export const Profile = () => {
    const { user } = useAuth();
    if (!user) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx(Navbar, {}), _jsx("main", { className: "pt-16", children: _jsx(ProfileComponent, {}) })] }));
};
