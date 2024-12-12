import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

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
  const [nudges, setNudges] = useState<Nudge[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchNudges = async () => {
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

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching nudges",
          description: error.message,
        });
        return;
      }

      setNudges(data);
    };

    fetchNudges();

    // Subscribe to realtime updates
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
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border">
      {nudges.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No messages yet
        </div>
      ) : (
        <div className="space-y-4 p-4">
          {nudges.map((nudge) => (
            <Card key={nudge.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-medium">
                      {nudge.sender.username || nudge.sender.full_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {nudge.message}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(nudge.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};