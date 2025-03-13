import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SupabaseError } from "@/types/supabaseError";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ForumTopic } from "@/types/forumTopic";

type ForumTopicWithCommentCount = {
    user_id: string;
} & ForumTopic & {
    comment_count: number;
    profiles: {
        username: string;
        full_name: string;
        avatar_url: string;
    };
    content: string;
};

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
    ` as string;

const { data: topicsData, isLoading, isError, error } = useQuery<ForumTopicWithCommentCount[], SupabaseError>({
        queryKey: ['forum-topics'],
        queryFn: async (): Promise<ForumTopicWithCommentCount[]> => {
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
            const validatedData = data.filter((item: any): item is ForumTopicWithCommentCount => {
                return (
                    typeof item.id === 'string' &&
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
                    typeof item.comment_count === 'number'
                );
            });

            return validatedData as unknown as ForumTopicWithCommentCount[];
        },
    });

    if (isError) {
        console.log("typeof error:", typeof error);
        return <div>Error loading topics: {(error as SupabaseError)?.message || "An unknown error occurred"}</div>;
    }

    const topics = topicsData || [];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Community Forum</h1>
                <Button asChild>
                    <Link to="/forum/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Topic
                    </Link>
                </Button>
            </div>

            {isLoading && (
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-muted-100 rounded-lg" />
                    ))}
                </div>
            )}

            {!isLoading && isError && (
                <div>Error loading topics: {(error as SupabaseError)?.message || "An unknown error occurred"}</div>
            )}

            {!isLoading && !isError && (
                topics.map(topic => (
                    <div key={topic.id} className="p-4 border rounded-lg hover:bg-accent/50">
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Link
                                        to={`/forum/${topic.id}/${topic.slug}`}
                                        className="font-semibold hover:underline"
                                    >
                                        {topic.title}
                                    </Link>
                                    {topic.is_pinned && (
                                        <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                                            Pinned
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm opacity-80">{topic.content}</div>
                                <div className="mt-2 flex items-center gap-4 text-sm opacity-80">
                                    <div>
                                        {topic.comment_count} comments
                                    </div>
                                    <div>
                                        Created by {topic.profiles?.full_name} on {new Date(topic.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
