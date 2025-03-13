import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
export const ProfileHeader = ({ profile, musician, isOwner, onImageUpload }) => {
    const displayName = musician?.name || profile?.full_name || profile?.username || "Anonymous User";
    const role = profile?.role === 'musician' ? 'Musician' : 'Music Enthusiast';
    const headerStyle = profile.banner_url ? {
        backgroundImage: `url(${profile.banner_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    } : {
        background: `linear-gradient(to right, ${profile.theme_colors?.primary || '#6B46C1'}33, ${profile.theme_colors?.secondary || '#4299E1'}33)`
    };
    return (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "h-48 transition-all duration-300", style: headerStyle }), _jsx("div", { className: "absolute left-1/2 -translate-x-1/2 -bottom-24", children: _jsxs("div", { className: "flex flex-col items-center space-y-4", children: [_jsxs("div", { className: "gradient-border relative group", children: [profile?.avatar_url ? (_jsx("img", { src: profile.avatar_url, alt: displayName, className: "w-40 h-40 rounded-lg object-cover bg-background" })) : (_jsx("div", { className: "w-40 h-40 rounded-lg bg-muted flex items-center justify-center", children: _jsx(User, { className: "h-16 w-16 text-muted-foreground" }) })), isOwner && (_jsxs("label", { className: "absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg", children: [_jsx(Input, { type: "file", accept: "image/*", className: "hidden", onChange: onImageUpload }), _jsx(User, { className: "h-8 w-8 text-white" })] }))] }), _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-3xl font-bold", children: displayName }), _jsx("p", { className: "text-muted-foreground mt-1", style: { color: profile.theme_colors?.accent }, children: role })] })] }) })] }));
};
