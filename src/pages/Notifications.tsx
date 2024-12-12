import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BellDot, UserPlus, Heart, ThumbsDown, Users, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      return data;
    },
    enabled: !!user,
  });

  const cancelCollaborationMutation = useMutation({
    mutationFn: async (collaborationData: { requesterId: string; musicianId: string }) => {
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('requester_id', collaborationData.requesterId)
        .eq('musician_id', collaborationData.musicianId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Collaboration request cancelled",
        description: "Your collaboration request has been cancelled successfully.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel collaboration request. Please try again.",
      });
    },
  });

  const getNotificationContent = (notification: any) => {
    const actorName = notification.actor?.full_name || notification.actor?.username;
    
    switch (notification.type) {
      case 'follow':
        return {
          icon: <Users className="h-5 w-5 text-blue-500" />,
          message: `${actorName} started following you`,
          action: (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/profile/${notification.actor_id}`)}
            >
              View Profile
            </Button>
          ),
        };
      
      case 'collaboration_request':
        return {
          icon: <UserPlus className="h-5 w-5 text-green-500" />,
          message: `${actorName} wants to collaborate with you`,
          action: notification.actor_id === user?.id ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (notification.reference_id) {
                  cancelCollaborationMutation.mutate({
                    requesterId: notification.actor_id,
                    musicianId: notification.reference_id,
                  });
                }
              }}
              disabled={cancelCollaborationMutation.isPending}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel Request
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/musician/${notification.reference_id}`)}
            >
              View Request
            </Button>
          ),
        };
      
      case 'song_reaction':
        const isLike = notification.reaction_type === 'like';
        return {
          icon: isLike ? 
            <Heart className="h-5 w-5 text-red-500" /> : 
            <ThumbsDown className="h-5 w-5 text-gray-500" />,
          message: `${actorName} ${isLike ? 'liked' : 'disliked'} your song`,
          action: (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/songs/${notification.reference_id}`)}
            >
              View Song
            </Button>
          ),
        };
      
      default:
        return {
          icon: <BellDot className="h-5 w-5" />,
          message: "New notification",
          action: null,
        };
    }
  };

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
              {notifications?.map((notification: any) => {
                const { icon, message, action } = getNotificationContent(notification);
                
                return (
                  <Card key={notification.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={notification.actor?.avatar_url} />
                        <AvatarFallback>
                          {(notification.actor?.username || 'U')[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {icon}
                          <p className="text-sm">{message}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {action}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};