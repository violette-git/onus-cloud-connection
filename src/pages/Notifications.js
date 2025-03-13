import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BellDot } from "lucide-react";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { Navbar } from "@/components/Navbar";
export const Notifications = () => {
    const { user } = useAuth();
    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications', user?.id],
        queryFn: async () => {
            if (!user?.id)
                return [];
            const { data, error } = await supabase
                .from('notifications')
                .select(`
          *,
          actor:profiles!notifications_actor_id_fkey (
            username,
            full_name,
            avatar_url
          )
        `)
                .eq('recipient_id', user.id)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            return data;
        },
        enabled: !!user,
    });
    if (!user) {
        return (_jsxs("div", { className: "min-h-screen", children: [_jsx(Navbar, {}), _jsx("main", { className: "container mx-auto px-4 pt-24", children: _jsx(Card, { children: _jsx(CardContent, { className: "flex items-center justify-center h-32", children: "Please sign in to view notifications" }) }) })] }));
    }
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx(Navbar, {}), _jsx("main", { className: "container mx-auto px-4 pt-24", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(BellDot, { className: "h-5 w-5" }), "Notifications"] }) }), _jsx(CardContent, { children: isLoading ? (_jsx("div", { className: "flex items-center justify-center h-32", children: "Loading notifications..." })) : notifications?.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-32", children: "No new notifications" })) : (_jsx("div", { className: "space-y-4", children: notifications?.map((notification) => (_jsx(NotificationCard, { notification: notification, currentUserId: user.id }, notification.id))) })) })] }) })] }));
};
