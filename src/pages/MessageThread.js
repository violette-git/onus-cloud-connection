import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NudgeForm } from "@/components/messaging/NudgeForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
export const MessageThread = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const { data: messages, isLoading } = useQuery({
        queryKey: ["messages", id],
        queryFn: async () => {
            if (!user || !id)
                return [];
            const { data, error } = await supabase
                .from("nudges")
                .select(`
          *,
          sender:profiles!nudges_sender_id_fkey (
            username,
            full_name,
            avatar_url
          )
        `)
                .or(`and(sender_id.eq.${user.id},recipient_id.eq.${id}),and(sender_id.eq.${id},recipient_id.eq.${user.id})`)
                .order("created_at", { ascending: true });
            if (error)
                throw error;
            return data;
        },
        enabled: !!user && !!id,
        refetchInterval: 1000, // Poll every second as backup
    });
    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);
    // Subscribe to new messages
    useEffect(() => {
        if (!user || !id)
            return;
        const channel = supabase
            .channel("message_thread")
            .on("postgres_changes", {
            event: "*",
            schema: "public",
            table: "nudges",
            filter: `or(and(sender_id.eq.${user.id},recipient_id.eq.${id}),and(sender_id.eq.${id},recipient_id.eq.${user.id}))`,
        }, () => {
            // Trigger a refetch when changes occur
            window.location.reload();
        })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, id]);
    // Mark messages as read
    useEffect(() => {
        const markMessagesAsRead = async () => {
            if (!user || !id || !messages?.length)
                return;
            await supabase
                .from("nudges")
                .update({ is_read: true })
                .eq("recipient_id", user.id)
                .eq("sender_id", id);
        };
        markMessagesAsRead();
    }, [user, id, messages]);
    const handleBack = () => {
        navigate(-1);
    };
    if (!user) {
        return (_jsx("div", { className: "container mx-auto px-4 pt-24", children: _jsx("p", { className: "text-center text-muted-foreground", children: "Please sign in to view messages." }) }));
    }
    return (_jsx("div", { className: "container mx-auto px-4 pt-24", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs(Button, { variant: "ghost", size: "sm", className: "mb-4", onClick: handleBack, children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back"] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Message Thread" }) }), _jsx(CardContent, { className: "space-y-4", children: isLoading ? (_jsx("div", { className: "flex items-center justify-center h-[400px] animate-pulse", children: _jsx("div", { className: "text-muted-foreground", children: "Loading messages..." }) })) : (_jsxs(_Fragment, { children: [_jsx(ScrollArea, { className: "h-[400px] w-full rounded-md border mb-4", ref: scrollRef, children: _jsx("div", { className: "space-y-4 p-4", children: messages?.map((message) => (_jsxs("div", { className: `flex gap-4 ${message.sender_id === user.id ? "flex-row-reverse" : ""}`, children: [_jsxs(Avatar, { className: "h-8 w-8", children: [_jsx(AvatarImage, { src: message.sender.avatar_url, alt: message.sender.username || message.sender.full_name }), _jsx(AvatarFallback, { children: _jsx(User, { className: "h-4 w-4" }) })] }), _jsxs("div", { className: `flex-1 space-y-1 ${message.sender_id === user.id
                                                            ? "text-right"
                                                            : "text-left"}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm font-medium", children: message.sender.username || message.sender.full_name }), _jsx("span", { className: "text-xs text-muted-foreground", children: formatDistanceToNow(new Date(message.created_at), {
                                                                            addSuffix: true,
                                                                        }) })] }), _jsx(Card, { children: _jsx(CardContent, { className: "p-3", children: _jsx("p", { className: "text-sm", children: message.message }) }) })] })] }, message.id))) }) }), _jsx(NudgeForm, { recipientId: id || "" })] })) })] })] }) }));
};
