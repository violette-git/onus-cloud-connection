import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
export const ForumTopicList = () => {
    const forumTopicQuery = `
        id,
        slug,
        title,
        content,
        is_pinned,
        is_locked,
        created_at,
        updated_at,
        user_id,
        profiles(username, full_name, avatar_url),
        (
            select count(*)
            from comments
            where comments.forum_topic_id = forum_topics.id
        ) as comment_count
    `;
    const { data: topicsData, isLoading, isError, error } = useQuery({
        queryKey: ['forum-topics'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('forum_topics')
                .select(forumTopicQuery, { count: 'exact' })
                .order('is_pinned', { ascending: false })
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }
            if (!data || !Array.isArray(data)) {
                return [];
            }
            // Filter out any items that are not of type ForumTopicWithCommentCount
            const validatedData = data.filter((item) => {
                return (typeof item.id === 'string' &&
                    typeof item.slug === 'string' &&
                    typeof item.title === 'string' &&
                    typeof item.content === 'string' &&
                    typeof item.is_pinned === 'boolean' &&
                    typeof item.is_locked === 'boolean' &&
                    typeof item.created_at === 'string' &&
                    typeof item.updated_at === 'string' &&
                    typeof item.user_id === 'string' &&
                    typeof item.profiles?.username === 'string' &&
                    typeof item.profiles?.full_name === 'string' &&
                    typeof item.profiles?.avatar_url === 'string' &&
                    typeof item.comment_count === 'number');
            });
            return validatedData;
        },
    });
    if (isError) {
        console.log("typeof error:", typeof error);
        return _jsxs("div", { children: ["Error loading topics: ", error?.message || "An unknown error occurred"] });
    }
    const topics = topicsData || [];
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Community Forum" }), _jsx(Button, { asChild: true, children: _jsxs(Link, { to: "/forum/new", children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "New Topic"] }) })] }), isLoading && (_jsx("div", { className: "animate-pulse space-y-4", children: [...Array(3)].map((_, i) => (_jsx("div", { className: "h-24 bg-muted-100 rounded-lg" }, i))) })), !isLoading && isError && (_jsxs("div", { children: ["Error loading topics: ", error?.message || "An unknown error occurred"] })), !isLoading && !isError && (topics.map(topic => (_jsx("div", { className: "p-4 border rounded-lg hover:bg-accent/50", children: _jsx("div", { className: "flex items-start gap-4", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Link, { to: `/forum/${topic.id}/${topic.slug}`, className: "font-semibold hover:underline", children: topic.title }), topic.is_pinned && (_jsx("span", { className: "text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full", children: "Pinned" }))] }), _jsx("div", { className: "text-sm opacity-80", children: topic.content }), _jsxs("div", { className: "mt-2 flex items-center gap-4 text-sm opacity-80", children: [_jsxs("div", { children: [topic.comment_count, " comments"] }), _jsxs("div", { children: ["Created by ", topic.profiles?.full_name, " on ", new Date(topic.created_at).toLocaleDateString()] })] })] }) }) }, topic.id))))] }));
};
