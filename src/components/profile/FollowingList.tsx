import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Profile } from "@/types/profile";

interface FollowingListProps {
  userId: string;
}

interface Following {
  followed: Profile;
}

export const FollowingList = ({ userId }: FollowingListProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: following } = useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      console.log('Fetching following data for userId:', userId);
      const { data, error } = await supabase
        .from('followers')
        .select(`
          followed:profiles!followers_followed_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('follower_id', userId);
      
      if (error) {
        console.error('Error fetching following:', error);
        throw error;
      }
      console.log('Following data:', data);
      return data as Following[];
    },
    enabled: !!userId,
  });

  const filteredFollowing = following?.filter(follow => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = follow.followed.full_name?.toLowerCase() || '';
    const username = follow.followed.username?.toLowerCase() || '';
    return fullName.includes(searchLower) || username.includes(searchLower);
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search following..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 bg-background"
      />
      {filteredFollowing?.map((follow) => (
        <div key={follow.followed.id} className="flex items-center justify-between p-4 bg-card/50 rounded-lg animate-fade-in">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-1 ring-border">
              <AvatarImage 
                src={follow.followed.avatar_url || undefined} 
                alt={follow.followed.username || 'User avatar'}
                className="object-cover w-full h-full"
              />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">
              {follow.followed.full_name || follow.followed.username}
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate(`/profile/${follow.followed.id}`)}
          >
            View Profile
          </Button>
        </div>
      ))}
      {!filteredFollowing?.length && (
        <p className="text-center text-muted-foreground">
          {searchTerm ? "No matching results" : "Not following anyone yet"}
        </p>
      )}
    </div>
  );
};