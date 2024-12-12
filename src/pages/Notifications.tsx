import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BellDot } from "lucide-react";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import type { Notification } from "@/components/notifications/types";

export const Notifications = () => {
  const { user } = useAuth();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          actor:profiles!notifications_actor_id_fkey (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            Please sign in to view notifications
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellDot className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              Loading notifications...
            </div>
          ) : notifications?.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              No new notifications
            </div>
          ) : (
            <div className="space-y-4">
              {notifications?.map((notification) => (
                <NotificationCard 
                  key={notification.id} 
                  notification={notification}
                  currentUserId={user.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};