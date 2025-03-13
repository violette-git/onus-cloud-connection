import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ThemeCustomization } from "@/components/profile/ThemeCustomization";
import { useProfileMutation } from "@/hooks/useProfileMutation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ensureCommentPreferences, ensureSocialLinks, ensureThemeColors } from "@/types/database";
export const Settings = () => {
    const { user } = useAuth();
    const updateProfileMutation = useProfileMutation();
    const { data: profile, isLoading } = useQuery({
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
            return {
                ...data,
                social_links: ensureSocialLinks(data.social_links),
                comment_preferences: ensureCommentPreferences(data.comment_preferences),
                theme_colors: ensureThemeColors(data.theme_colors)
            };
        },
        enabled: !!user?.id,
    });
    if (isLoading) {
        return _jsx("div", { children: "Loading..." });
    }
    if (!profile) {
        return _jsx("div", { children: "Profile not found" });
    }
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Settings" }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Theme Customization" }) }), _jsx(CardContent, { children: _jsx(ThemeCustomization, { profile: profile, onUpdate: (colors) => updateProfileMutation.mutateAsync({
                                        id: profile.id,
                                        theme_colors: colors
                                    }) }) })] }), _jsx(Separator, {})] })] }));
};
