import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentSection } from "@/components/profile/comments/CommentSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VideoEmbed } from "@/components/profile/VideoEmbed";
import { SunoPlayer } from "@/components/profile/SunoPlayer";
import { Card } from "@/components/ui/card";
export const Comments = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const { data: content, isLoading: isLoadingContent } = useQuery({
        queryKey: ['content', type, id],
        queryFn: async () => {
            if (!type || !id)
                return null;
            const table = type === 'song' ? 'songs' : 'videos';
            const { data, error } = await supabase
                .from(table)
                .select(`*
          ,
          musician:musicians (
            name
          )
        `)
                .eq('id', id)
                .single();
            if (error)
                throw error;
            return data;
        },
        enabled: !!type && !!id,
    });
    if (!type || !id) {
        return null;
    }
    return (_jsxs("div", { className: "container mx-auto px-4 pt-24", children: [_jsxs(Button, { variant: "ghost", size: "sm", className: "mb-4", onClick: () => navigate(-1), children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back"] }), content && (_jsx(Card, { className: "mb-8", children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: content.title }), _jsxs("p", { className: "text-muted-foreground mb-4", children: ["By ", content.musician?.name] }), type === 'video' ? (_jsx(VideoEmbed, { video: content })) : (_jsx(SunoPlayer, { songId: content.url }))] }) })), _jsx(CommentSection, { contentId: id, contentType: type })] }));
};
