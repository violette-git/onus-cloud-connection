export interface ForumTopic {
  id: string;
  slug: string;
  title: string;
  category: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  user: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
  comment_count: number;
}

export interface ForumTopicWithComments extends ForumTopic {
  comments: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    user: {
      username: string | null;
      full_name: string | null;
      avatar_url: string | null;
    };
  }[];
}
