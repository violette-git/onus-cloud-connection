import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const NudgeList = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [threads, setThreads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (!user)
            return;
        const fetchThreads = async () => {
            setIsLoading(true);
            const { data: messages, error } = await supabase
                .from("nudges")
                .select(`
          *,
          sender:profiles!nudges_sender_id_fkey (
            username,
            full_name,
            avatar_url
          ),
          recipient:profiles!nudges_recipient_id_fkey (
            username,
            full_name,
            avatar_url
          )
        `)
                .or(`recipient_id.eq.${user.id},sender_id.eq.${user.id}`)
                .order("created_at", { ascending: false });
            setIsLoading(false);
            if (error) {
                toast({
                    variant: "destructive",
                    title: "Error fetching messages",
                    description: error.message,
                });
                return;
            }
            // Group messages by thread (conversation between two users)
            const threadMap = new Map();
            messages?.forEach((message) => {
                const otherUserId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
                const threadId = [user.id, otherUserId].sort().join('-');
                if (!threadMap.has(threadId)) {
                    if (user) {
                        const otherUser = message.sender_id === user.id ? message.recipient : message.sender;
                        threadMap.set(threadId, {
                            id: threadId,
                            other_user_id: otherUserId,
                            last_message: message.message,
                            last_message_time: message.created_at,
                            is_read: message.is_read,
                            other_user: {
                                username: otherUser.username || "",
                                full_name: otherUser.full_name || "",
                                avatar_url: otherUser.avatar_url || "",
                            },
                        });
                    }
                    else {
                        console.error("User is not authenticated.");
                    }
                }
            });
            setThreads(Array.from(threadMap.values()));
        };
        fetchThreads();
        const channel = supabase
            .channel("threads")
            .on("postgres_changes", {
            event: "*",
            schema: "public",
            table: "nudges",
            filter: `or(recipient_id.eq.${user.id},sender_id.eq.${user.id})`,
        }, () => {
            fetchThreads();
        })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, toast]);
    const handleThreadClick = (otherUserId) => {
        if (user) {
            navigate(`/messages/${otherUserId}`);
        }
        else {
            console.error("User is not authenticated.");
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-[400px] animate-pulse", children: _jsx("div", { className: "text-muted-foreground", children: "Loading messages..." }) }));
    }
    return (_jsx(ScrollArea, { className: "h-[400px] w-full rounded-md border", children: threads.length === 0 ? (_jsxs("div", { className: "p-8 text-center text-muted-foreground flex flex-col items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-muted flex items-center justify-center", children: _jsx(User, { className: "h-6 w-6 text-muted-foreground" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: "No messages yet" }), _jsx("p", { className: "text-sm", children: "Start a conversation with someone!" })] })] })) : (_jsx("div", { className: "space-y-4 p-4", children: threads.map((thread) => (_jsx(Card, { className: "transition-all duration-200 hover:bg-accent/50 animate-fade-in cursor-pointer", onClick: () => handleThreadClick(thread.other_user_id), children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsxs(Avatar, { className: "h-10 w-10", children: [_jsx(AvatarImage, { src: thread.other_user.avatar_url, alt: thread.other_user.username || thread.other_user.full_name }), _jsx(AvatarFallback, { children: _jsx(User, { className: "h-4 w-4" }) })] }), _jsxs("div", { className: "flex-1 space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "font-medium", children: thread.other_user.username || thread.other_user.full_name }), _jsx("span", { className: "text-xs text-muted-foreground", children: formatDistanceToNow(new Date(thread.last_message_time), {
                                                    addSuffix: true,
                                                }) })] }), _jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: thread.last_message }), user && !thread.is_read && thread.other_user_id !== user.id && (_jsx("div", { className: "mt-2", children: _jsx("span", { className: "inline-block w-2 h-2 bg-primary rounded-full" }) }))] })] }) }) }, thread.id))) })) }));
};
