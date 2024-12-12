import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BellDot } from "lucide-react";

export const Notifications = () => {
  const { user } = useAuth();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Fetch collaboration requests
      const { data: collaborations } = await supabase
        .from('collaborators')
        .select(`
          *,
          musicians:musicians(name, avatar_url),
          requester:profiles(username, full_name, avatar_url)
        `)
        .eq('musician_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      return collaborations || [];
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
              {notifications?.map((notification: any) => (
                <Card key={notification.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">
                          {notification.requester?.full_name || notification.requester?.username}
                        </span>{' '}
                        wants to collaborate with{' '}
                        <span className="font-semibold">
                          {notification.musicians?.name}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};