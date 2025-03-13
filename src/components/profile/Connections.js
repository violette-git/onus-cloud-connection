import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowingList } from "./FollowingList";
import { FollowersList } from "./FollowersList";
import { CollaboratorsList } from "./CollaboratorsList";
import { CollaborationRequests } from "./CollaborationRequests";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
export const Connections = ({ userId }) => {
    const { user } = useAuth();
    // Check if the user is a musician to show collaboration requests
    const { data: userProfile } = useQuery({
        queryKey: ['profile', userId],
        queryFn: async () => {
            const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();
            return data;
        },
        enabled: !!userId,
    });
    // Get musician ID if the user is a musician
    const { data: musician } = useQuery({
        queryKey: ['musician', userId],
        queryFn: async () => {
            const { data } = await supabase
                .from('musicians')
                .select('id')
                .eq('user_id', userId)
                .single();
            return data;
        },
        enabled: !!userId && userProfile?.role === 'musician',
    });
    return (_jsxs(Tabs, { defaultValue: "following", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [_jsx(TabsTrigger, { value: "following", children: "Following" }), _jsx(TabsTrigger, { value: "followers", children: "Followers" }), _jsx(TabsTrigger, { value: "collaborators", children: "Collaborators" })] }), _jsx(TabsContent, { value: "following", children: _jsx(FollowingList, { userId: userId }) }), _jsx(TabsContent, { value: "followers", children: _jsx(FollowersList, { userId: userId }) }), _jsx(TabsContent, { value: "collaborators", children: _jsxs("div", { className: "space-y-6", children: [userProfile?.role === 'musician' && musician?.id && (_jsx(CollaborationRequests, { musicianId: musician.id })), _jsx(CollaboratorsList, { userId: userId })] }) })] }));
};
