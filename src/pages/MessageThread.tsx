import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NudgeForm } from "@/components/messaging/NudgeForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  created_at: string;
  sender: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

export const MessageThread = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading, refetch } = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      if (!user || !id) return [];

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

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!user && !!id,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Subscribe to new messages
  useEffect(() => {
    if (!user || !id) return;

    const channel = supabase
      .channel("message_thread")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "nudges",
          filter: `or(and(sender_id.eq.${user.id},recipient_id.eq.${id}),and(sender_id.eq.${id},recipient_id.eq.${user.id}))`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, id, refetch]);

  // Mark messages as read
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!user || !id) return;

      await supabase
        .from("nudges")
        .update({ is_read: true })
        .eq("recipient_id", user.id)
        .eq("sender_id", id);
    };

    markMessagesAsRead();
  }, [user, id, messages]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <p className="text-center text-muted-foreground">
          Please sign in to view messages.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Message Thread</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-[400px] animate-pulse">
                <div className="text-muted-foreground">Loading messages...</div>
              </div>
            ) : (
              <>
                <ScrollArea className="h-[400px] w-full rounded-md border mb-4" ref={scrollRef}>
                  <div className="space-y-4 p-4">
                    {messages?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-4 ${
                          message.sender_id === user.id ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={message.sender.avatar_url}
                            alt={message.sender.username || message.sender.full_name}
                          />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`flex-1 space-y-1 ${
                            message.sender_id === user.id
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {message.sender.username || message.sender.full_name}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(message.created_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <Card>
                            <CardContent className="p-3">
                              <p className="text-sm">{message.message}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <NudgeForm recipientId={id || ""} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};