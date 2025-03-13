import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CollaboratorCard } from "./collaborators/CollaboratorCard";
import { SearchCollaborators } from "./collaborators/SearchCollaborators";
import { useState } from "react";
import { ensureCommentPreferences, ensureSocialLinks } from "@/types/database";
export const CollaboratorsList = ({ userId }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: collaborations } = useQuery({
        queryKey: ['collaborators', userId],
        queryFn: async () => {
            // First, get the musician ID if the user is a musician
            const { data: musician } = await supabase
                .from('musicians')
                .select('id')
                .eq('user_id', userId)
                .single();
            // Then fetch collaborations where user is either requester or the musician
            const { data, error } = await supabase
                .from('collaborators')
                .select(`
          musician_id,
          requester_id,
          musician:musicians!collaborators_musician_id_fkey (
            id,
            name,
            user_id,
            profile:profiles!musicians_user_id_fkey (*)
          ),
          requester:profiles!collaborators_requester_id_fkey (*)
        `)
                .eq('status', 'accepted')
                .or(`requester_id.eq.${userId},musician_id.eq.${musician?.id || 'null'}`);
            if (error) {
                console.error('Error fetching collaborations:', error);
                throw error;
            }
            return data.map(collab => ({
                ...collab,
                musician: {
                    ...collab.musician,
                    profile: {
                        ...collab.musician.profile,
                        social_links: ensureSocialLinks(collab.musician.profile.social_links),
                        comment_preferences: ensureCommentPreferences(collab.musician.profile.comment_preferences)
                    }
                },
                requester: {
                    ...collab.requester,
                    social_links: ensureSocialLinks(collab.requester.social_links),
                    comment_preferences: ensureCommentPreferences(collab.requester.comment_preferences)
                }
            }));
        },
        enabled: !!userId,
    });
    const filteredCollaborators = collaborations?.map(collab => {
        // If the current user is the requester, show the musician
        // If the current user is the musician, show the requester
        const isRequester = collab.requester_id === userId;
        if (isRequester) {
            return {
                id: collab.musician.id,
                name: collab.musician.name,
                profile: collab.musician.profile,
                userId: collab.musician.user_id // Add this for correct navigation
            };
        }
        else {
            return {
                id: collab.musician.id,
                name: collab.requester.username || '',
                profile: collab.requester,
                userId: collab.requester.id // Add this for correct navigation
            };
        }
    }).filter(collab => {
        if (!searchTerm.trim())
            return true;
        const searchLower = searchTerm.toLowerCase().trim();
        const fullName = (collab.profile?.full_name || '').toLowerCase();
        const username = (collab.profile?.username || '').toLowerCase();
        const name = collab.name.toLowerCase();
        return fullName.includes(searchLower) ||
            username.includes(searchLower) ||
            name.includes(searchLower);
    });
    return (_jsxs("div", { className: "space-y-4", children: [_jsx(SearchCollaborators, { searchTerm: searchTerm, onSearch: setSearchTerm }), filteredCollaborators?.map((collab) => (_jsx(CollaboratorCard, { id: collab.userId, name: collab.name, profile: collab.profile }, `${collab.id}-${collab.profile?.id}`))), !filteredCollaborators?.length && (_jsx("p", { className: "text-center text-muted-foreground", children: searchTerm ? "No matching results" : "No collaborators yet" }))] }));
};
