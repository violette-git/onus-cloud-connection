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

interface Thread {
  id: string;
  other_user_id: string;
  last_message: string;
  last_message_time: string;
  is_read: boolean;
  other_user: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

export const NudgeList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

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
      const threadMap = new Map<string, Thread>();
      
      messages.forEach((message) => {
        const otherUserId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
        const threadId = [user.id, otherUserId].sort().join('-');
        
        if (!threadMap.has(threadId)) {
          threadMap.set(threadId, {
            id: threadId,
            other_user_id: otherUserId,
            last_message: message.message,
            last_message_time: message.created_at,
            is_read: message.is_read,
            other_user: message.sender_id === user.id ? message.recipient : message.sender,
          });
        }
      });

      setThreads(Array.from(threadMap.values()));
    };

    fetchThreads();

    const channel = supabase
      .channel("threads")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "nudges",
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          fetchThreads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const handleThreadClick = (otherUserId: string) => {
    navigate(`/messages/${otherUserId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] animate-pulse">
        <div className="text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border">
      {threads.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">No messages yet</p>
            <p className="text-sm">Start a conversation with someone!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 p-4">
          {threads.map((thread) => (
            <Card 
              key={thread.id}
              className="transition-all duration-200 hover:bg-accent/50 animate-fade-in cursor-pointer"
              onClick={() => handleThreadClick(thread.other_user_id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={thread.other_user.avatar_url} 
                      alt={thread.other_user.username || thread.other_user.full_name} 
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {thread.other_user.username || thread.other_user.full_name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(thread.last_message_time), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {thread.last_message}
                    </p>
                    {!thread.is_read && thread.other_user_id !== user.id && (
                      <div className="mt-2">
                        <span className="inline-block w-2 h-2 bg-primary rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};