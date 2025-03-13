import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Settings, User, LogOut, BellDot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthForm } from "../auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
export const AuthButtons = ({ onAction }) => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const { data: profile } = useQuery({
        queryKey: ['profile', user?.id],
        queryFn: async () => {
            if (!user?.id)
                return null;
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (error)
                throw error;
            return data;
        },
        enabled: !!user,
    });
    const handleNavigation = (path) => {
        navigate(path);
        if (onAction) {
            setTimeout(() => {
                onAction();
            }, 100);
        }
    };
    const handleSignOut = async () => {
        await signOut();
        if (onAction) {
            onAction();
        }
    };
    const displayName = profile?.full_name || profile?.username || "User";
    return (_jsx("div", { className: "flex items-center gap-4", children: user ? (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", className: "relative h-8 w-8 rounded-full", children: _jsxs(Avatar, { className: "h-8 w-8", children: [_jsx(AvatarImage, { src: profile?.avatar_url || undefined, alt: displayName, className: "object-cover" }), _jsx(AvatarFallback, { children: _jsx(User, { className: "h-4 w-4" }) })] }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsxs(DropdownMenuItem, { onClick: () => handleNavigation('/profile'), children: [_jsx(User, { className: "mr-2 h-4 w-4" }), "Profile"] }), _jsxs(DropdownMenuItem, { onClick: () => handleNavigation('/notifications'), children: [_jsx(BellDot, { className: "mr-2 h-4 w-4" }), "Notifications"] }), _jsxs(DropdownMenuItem, { onClick: () => handleNavigation('/settings'), children: [_jsx(Settings, { className: "mr-2 h-4 w-4" }), "Settings"] }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { onClick: handleSignOut, children: [_jsx(LogOut, { className: "mr-2 h-4 w-4" }), "Sign Out"] })] })] })) : (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { size: "sm", className: "w-full md:w-auto", children: "Sign In" }) }), _jsx(DialogContent, { className: "sm:max-w-md", children: _jsx(AuthForm, {}) })] })) }));
};
