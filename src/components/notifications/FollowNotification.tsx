import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationProps } from "./types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const FollowNotification = ({ notification, navigate }: NotificationProps) => {
  const actorName = notification.actor?.full_name || notification.actor?.username;

  const { data: musician } = useQuery({
    queryKey: ['musician-by-user', notification.actor_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('musicians')
        .select('id')
        .eq('user_id', notification.actor_id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const handleViewProfile = () => {
    if (musician) {
      navigate(`/musicians/${musician.id}`);
    } else {
      navigate(`/profile/${notification.actor_id}`);
    }
  };

  return {
    icon: <Users className="h-5 w-5 text-blue-500" />,
    message: `${actorName} started following you`,
    action: (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleViewProfile}
      >
        View Profile
      </Button>
    ),
  };
};