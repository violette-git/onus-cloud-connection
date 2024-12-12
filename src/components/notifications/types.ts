export interface Notification {
  id: string;
  type: 'follow' | 'collaboration_request' | 'song_reaction';
  actor: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
  actor_id: string;
  reference_id: string;
  created_at: string;
  reaction_type?: 'like' | 'dislike';
}

export interface NotificationProps {
  notification: Notification;
  currentUserId?: string;
  navigate: (path: string) => void;
}