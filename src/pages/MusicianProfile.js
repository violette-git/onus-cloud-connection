import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MusicianHeader } from "@/components/profile/musician/MusicianHeader";
import { MusicianContent } from "@/components/profile/musician/MusicianContent";
import { CollaborationRequests } from "@/components/profile/CollaborationRequests";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { FeaturedContent } from "@/components/profile/FeaturedContent";
import { useToast } from "@/hooks/use-toast";
import { MusicianProfileSkeleton } from "@/components/profile/musician/MusicianProfileSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const MusicianProfile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { data: musician, isLoading, error } = useQuery({
        queryKey: ['musician', id],
        queryFn: async () => {
            if (!id)
                return null;
            const { data, error } = await supabase
                .from('musicians')
                .select(`
          *,
          profile:profiles!musicians_profile_id_fkey (
            avatar_url,
            username,
            full_name
          ),
          musician_genres (
            genre: genres (name)
          ),
          songs (
            id,
            title,
            lyrics,
            created_at,
            updated_at
          ),
          videos (
            id,
            title,
            url,
            platform,
            created_at,
            updated_at
          )
        `)
                .eq('id', id)
                .maybeSingle();
            if (error) {
                console.error('Error fetching musician:', error);
                throw error;
            }
            if (!data) {
                throw new Error('Musician not found');
            }
            return data;
        },
        meta: {
            onError: () => {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "This musician profile doesn't exist or has been removed.",
                });
                navigate('/musicians');
            }
        }
    });
    if (isLoading) {
        return _jsx(MusicianProfileSkeleton, {});
    }
    if (!musician)
        return null;
    const isOwner = user?.id === musician.user_id;
    return (_jsx(ErrorBoundary, { children: _jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("div", { className: "h-[280px] bg-gradient-to-br from-onus-purple/20 via-onus-blue/20 to-onus-pink/20", children: _jsx("div", { className: "container mx-auto px-4 pt-8", children: _jsx(BackButton, {}) }) }), _jsxs("div", { className: "container mx-auto px-4", children: [_jsx("div", { className: "-mt-24 mb-12", children: _jsx(MusicianHeader, { musician: musician }) }), _jsx("div", { className: "mb-8", children: _jsx(FeaturedContent, { musicianId: musician.id, isOwner: isOwner, songs: musician.songs || [], videos: musician.videos || [] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [_jsxs("div", { className: "lg:col-span-8 space-y-6", children: [isOwner && (_jsx(Card, { children: _jsx(CardContent, { className: "p-6", children: _jsx(CollaborationRequests, { musicianId: musician.id }) }) })), _jsx(MusicianContent, { musician: musician, isOwner: isOwner })] })]} )] })] }) }));
};
