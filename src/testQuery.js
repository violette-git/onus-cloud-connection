import { supabase } from "@/integrations/supabase/client";
const fetchForumTopics = async () => {
    const { data, error } = await supabase
        .from('forum_topics')
        .select(`
      id,
      slug,
      title,
      content,
      is_pinned,
      is_locked,
      created_at,
      updated_at,
      user_id,
      profiles(username, full_name, avatar_url),
      (
        select count(*)
        from comments
        where comments.forum_topic_id = forum_topics.id
      ) as comment_count
    `)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Supabase error:', error);
    }
    else {
        console.log('Supabase data:', data);
    }
};
fetchForumTopics();
