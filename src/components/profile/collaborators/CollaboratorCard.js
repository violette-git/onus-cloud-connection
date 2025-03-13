import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
export const CollaboratorCard = ({ id, name, profile }) => {
    const navigate = useNavigate();
    const displayName = profile?.full_name || profile?.username || name;
    const handleProfileClick = () => {
        if (profile?.role === 'musician') {
            // For musicians, first get their musician profile ID
            supabase
                .from('musicians')
                .select('id')
                .eq('user_id', id)
                .single()
                .then(({ data: musician, error }) => {
                if (!error && musician) {
                    navigate(`/musicians/${musician.id}`);
                }
                else {
                    // Fallback to regular profile if no musician profile found
                    navigate(`/profile/${id}`);
                }
            });
        }
        else {
            // For non-musicians, go to regular profile
            navigate(`/profile/${id}`);
        }
    };
    return (_jsxs("div", { className: "flex items-center justify-between p-4 bg-card/50 rounded-lg animate-fade-in", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Avatar, { className: "h-12 w-12 ring-1 ring-border", children: [_jsx(AvatarImage, { src: profile?.avatar_url || undefined, alt: displayName, className: "object-cover w-full h-full" }), _jsx(AvatarFallback, { children: _jsx(User, { className: "h-6 w-6" }) })] }), _jsx("span", { className: "font-medium", children: displayName })] }), _jsx(Button, { variant: "ghost", onClick: handleProfileClick, children: "View Profile" })] }));
};
