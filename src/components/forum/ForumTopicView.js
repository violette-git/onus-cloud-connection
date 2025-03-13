import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CommentSection } from "@/components/profile/comments/CommentSection";
import { useAuth } from "@/contexts/AuthContext";
export const ForumTopicView = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { data: rawTopic, isLoading, isError, error } = useQuery({
        queryKey: ['forum-topic', id],
        queryFn: async () => {
            if (!id) {
                throw new Error('Topic ID is undefined');
            }
            const { data, error } = await supabase
                .from('forum_topics')
                .select(`
          *,
          user:profiles!forum_topics_user_id_fkey (
            username,
            full_name,
            avatar_url
          )
        `)
                .eq('id', id)
                .single();
            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }
            if (!data) {
                return null;
            }
            return data;
        },
        enabled: !!id, // Only run the query if id is defined
    });
    const updateCommentSection = () => {
        queryClient.invalidateQueries({
            queryKey: ['comments', 'forum', id]
        });
    };
    if (isLoading) {
        return (_jsxs("div", { className: "animate-pulse space-y-4", children: [_jsx("div", { className: "h-8 bg-muted w-1/4 rounded" }), _jsx("div", { className: "h-4 bg-muted w-2/3 rounded" }), _jsx("div", { className: "h-32 bg-muted rounded-lg" })] }));
    }
    if (isError) {
        return (_jsxs("div", { className: "text-center py-8 text-muted-foreground", children: ["Failed to load the topic: ", error?.message] }));
    }
    if (!rawTopic) {
        return (_jsx("div", { className: "text-center py-8 text-muted-foreground", children: "Topic not found" }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(Button, { variant: "ghost", asChild: true, className: "mb-4", children: _jsxs(Link, { to: "/forum", className: "flex items-center gap-2", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to Forum"] }) }), _jsxs("div", { className: "border rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-4 mb-6", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: rawTopic?.title }), _jsxs("div", { className: "text-sm text-muted-foreground", children: ["Posted by ", rawTopic?.user?.full_name || 'Anonymous', " \u2022", rawTopic?.created_at ? new Date(rawTopic.created_at).toLocaleDateString() : ''] })] }), user?.id === rawTopic?.user_id && (_jsx(Button, { variant: "outline", size: "sm", children: "Edit Topic" }))] }), _jsx("div", { className: "prose dark:prose-invert mb-8", children: rawTopic?.content }), _jsx(CommentSection, { contentId: rawTopic?.id || '', contentType: "forum" })] })] }));
};
