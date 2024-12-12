export type NotificationType = 'follow' | 'collaboration_request' | 'song_reaction' | 'nudge';

export interface Notification {
  id: string;
  type: NotificationType;
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