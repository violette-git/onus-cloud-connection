import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Reply } from "lucide-react";
import { NudgeForm } from "./NudgeForm";
import { useNavigate } from "react-router-dom";

interface Nudge {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  sender: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

export const NudgeList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchNudges = async () => {
      setIsLoading(true);
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

      setNudges(data);
    };

    fetchNudges();

    const channel = supabase
      .channel("nudges")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "nudges",
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNudges((current) => [payload.new as Nudge, ...current]);
            toast({
              title: "New message",
              description: "You have received a new message.",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const handleNotificationClick = (senderId: string) => {
    navigate(`/messages/${senderId}`);
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
      {nudges.length === 0 ? (
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
          {nudges.map((nudge) => (
            <div key={nudge.id} className="space-y-2">
              <Card 
                className="transition-all duration-200 hover:bg-accent/50 animate-fade-in cursor-pointer"
                onClick={() => handleNotificationClick(nudge.sender_id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={nudge.sender.avatar_url} 
                        alt={nudge.sender.username || nudge.sender.full_name} 
                      />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {nudge.sender.username || nudge.sender.full_name}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(nudge.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {nudge.message}
                      </p>
                      {user?.id !== nudge.sender_id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReplyTo(nudge.sender_id);
                          }}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2"
                        >
                          <Reply className="h-3 w-3" />
                          Reply
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              {replyTo === nudge.sender_id && (
                <div className="pl-14">
                  <NudgeForm 
                    recipientId={nudge.sender_id}
                    onSuccess={() => setReplyTo(null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};