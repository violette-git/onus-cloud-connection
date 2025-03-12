-- seed.sql
-- Seed data for Onus Cloud Connection

-- Clear existing data (if any)
TRUNCATE TABLE profiles, forum_topics, comments, musicians, genres, followers, collaborators, 
  featured_content, linking_codes, musician_genres, notifications, nudges, song_reactions, 
  songs, videos CASCADE;

-- Insert sample genres with variables to maintain relationships
DO $$
DECLARE
  rock_id UUID;
  pop_id UUID;
  hip_hop_id UUID;
  electronic_id UUID;
  jazz_id UUID;
  alt_rock_id UUID;
  indie_pop_id UUID;
  
  user1_id UUID;
  user2_id UUID;
  user3_id UUID;
  user4_id UUID;
  admin_id UUID;
  
  musician1_id UUID;
  musician2_id UUID;
  musician3_id UUID;
  
  forum_topic1_id UUID;
  forum_topic2_id UUID;
  forum_topic3_id UUID;
  forum_topic4_id UUID;
  
  comment1_id UUID;
  comment2_id UUID;
  comment3_id UUID;
  comment4_id UUID;
  comment5_id UUID;
  
  song1_id UUID;
  song2_id UUID;
  song3_id UUID;
  
  video1_id UUID;
  video2_id UUID;
BEGIN
  -- Insert genres
  INSERT INTO genres (id, name, created_at, created_by, parent_genre_id) 
  VALUES (uuid_generate_v4(), 'Rock', NOW(), NULL, NULL) 
  RETURNING id INTO rock_id;
  
  INSERT INTO genres (id, name, created_at, created_by, parent_genre_id) 
  VALUES (uuid_generate_v4(), 'Pop', NOW(), NULL, NULL)
  RETURNING id INTO pop_id;
  
  INSERT INTO genres (id, name, created_at, created_by, parent_genre_id) 
  VALUES (uuid_generate_v4(), 'Hip Hop', NOW(), NULL, NULL)
  RETURNING id INTO hip_hop_id;
  
  INSERT INTO genres (id, name, created_at, created_by, parent_genre_id) 
  VALUES (uuid_generate_v4(), 'Electronic', NOW(), NULL, NULL)
  RETURNING id INTO electronic_id;
  
  INSERT INTO genres (id, name, created_at, created_by, parent_genre_id) 
  VALUES (uuid_generate_v4(), 'Jazz', NOW(), NULL, NULL)
  RETURNING id INTO jazz_id;
  
  INSERT INTO genres (id, name, created_at, created_by, parent_genre_id) 
  VALUES (uuid_generate_v4(), 'Alternative Rock', NOW(), NULL, rock_id)
  RETURNING id INTO alt_rock_id;
  
  INSERT INTO genres (id, name, created_at, created_by, parent_genre_id) 
  VALUES (uuid_generate_v4(), 'Indie Pop', NOW(), NULL, pop_id)
  RETURNING id INTO indie_pop_id;

  -- Insert profiles
  INSERT INTO profiles (id, username, full_name, avatar_url, created_at, updated_at, role, visibility, handle) 
  VALUES (uuid_generate_v4(), 'johndoe', 'John Doe', 'https://i.pravatar.cc/150?u=johndoe', NOW(), NOW(), 'user', 'public', 'johndoe')
  RETURNING id INTO user1_id;
  
  INSERT INTO profiles (id, username, full_name, avatar_url, created_at, updated_at, role, visibility, handle) 
  VALUES (uuid_generate_v4(), 'janedoe', 'Jane Doe', 'https://i.pravatar.cc/150?u=janedoe', NOW(), NOW(), 'user', 'public', 'janedoe')
  RETURNING id INTO user2_id;
  
  INSERT INTO profiles (id, username, full_name, avatar_url, created_at, updated_at, role, visibility, handle) 
  VALUES (uuid_generate_v4(), 'bobsmith', 'Bob Smith', 'https://i.pravatar.cc/150?u=bobsmith', NOW(), NOW(), 'user', 'public', 'bobsmith')
  RETURNING id INTO user3_id;
  
  INSERT INTO profiles (id, username, full_name, avatar_url, created_at, updated_at, role, visibility, handle) 
  VALUES (uuid_generate_v4(), 'alicejones', 'Alice Jones', 'https://i.pravatar.cc/150?u=alicejones', NOW(), NOW(), 'user', 'public', 'alicejones')
  RETURNING id INTO user4_id;
  
  INSERT INTO profiles (id, username, full_name, avatar_url, created_at, updated_at, role, visibility, handle) 
  VALUES (uuid_generate_v4(), 'admin', 'Admin User', 'https://i.pravatar.cc/150?u=admin', NOW(), NOW(), 'admin', 'public', 'admin')
  RETURNING id INTO admin_id;

  -- Insert musicians
  INSERT INTO musicians (id, name, user_id, created_at, updated_at, bio, location, genre_id) 
  VALUES (uuid_generate_v4(), 'John Doe Music', user1_id, NOW(), NOW(), 'Indie musician from Seattle', 'Seattle, WA', alt_rock_id)
  RETURNING id INTO musician1_id;
  
  INSERT INTO musicians (id, name, user_id, created_at, updated_at, bio, location, genre_id) 
  VALUES (uuid_generate_v4(), 'Jane Doe Band', user2_id, NOW(), NOW(), 'Electronic music producer', 'Los Angeles, CA', electronic_id)
  RETURNING id INTO musician2_id;
  
  INSERT INTO musicians (id, name, user_id, created_at, updated_at, bio, location, genre_id) 
  VALUES (uuid_generate_v4(), 'Bob Smith Jazz', user3_id, NOW(), NOW(), 'Jazz enthusiast and performer', 'New Orleans, LA', jazz_id)
  RETURNING id INTO musician3_id;

  -- Insert musician genres
  INSERT INTO musician_genres (musician_id, genre_id, created_at) 
  VALUES (musician1_id, alt_rock_id, NOW());
  
  INSERT INTO musician_genres (musician_id, genre_id, created_at) 
  VALUES (musician1_id, indie_pop_id, NOW());
  
  INSERT INTO musician_genres (musician_id, genre_id, created_at) 
  VALUES (musician2_id, electronic_id, NOW());
  
  INSERT INTO musician_genres (musician_id, genre_id, created_at) 
  VALUES (musician3_id, jazz_id, NOW());

  -- Insert forum topics
  INSERT INTO forum_topics (id, title, content, user_id, created_at, updated_at, slug, category, is_pinned, is_locked) 
  VALUES (uuid_generate_v4(), 'Welcome to the Onus Community', 'This is the official welcome thread for all new members. Feel free to introduce yourself!', admin_id, NOW(), NOW(), 'welcome-to-the-onus-community', 'General', TRUE, FALSE)
  RETURNING id INTO forum_topic1_id;
  
  INSERT INTO forum_topics (id, title, content, user_id, created_at, updated_at, slug, category, is_pinned, is_locked) 
  VALUES (uuid_generate_v4(), 'Tips for Collaborating with Other Musicians', 'Share your best practices for successful music collaborations.', user1_id, NOW(), NOW(), 'tips-for-collaborating-with-other-musicians', 'Collaboration', FALSE, FALSE)
  RETURNING id INTO forum_topic2_id;
  
  INSERT INTO forum_topics (id, title, content, user_id, created_at, updated_at, slug, category, is_pinned, is_locked) 
  VALUES (uuid_generate_v4(), 'Favorite Music Production Software?', 'What DAW or production software do you use and why?', user2_id, NOW(), NOW(), 'favorite-music-production-software', 'Production', FALSE, FALSE)
  RETURNING id INTO forum_topic3_id;
  
  INSERT INTO forum_topics (id, title, content, user_id, created_at, updated_at, slug, category, is_pinned, is_locked) 
  VALUES (uuid_generate_v4(), 'Upcoming Virtual Music Events', 'Let''s share information about upcoming virtual concerts and music events.', user3_id, NOW(), NOW(), 'upcoming-virtual-music-events', 'Events', FALSE, FALSE)
  RETURNING id INTO forum_topic4_id;

  -- Insert comments
  INSERT INTO comments (id, content, user_id, content_id, content_type, created_at, updated_at, parent_id, depth) 
  VALUES (uuid_generate_v4(), 'Welcome everyone! Excited to have you all here.', admin_id, forum_topic1_id, 'forum_topic', NOW(), NOW(), NULL, 0)
  RETURNING id INTO comment1_id;
  
  INSERT INTO comments (id, content, user_id, content_id, content_type, created_at, updated_at, parent_id, depth) 
  VALUES (uuid_generate_v4(), 'Thanks for the warm welcome!', user1_id, forum_topic1_id, 'forum_topic', NOW(), NOW(), comment1_id, 1)
  RETURNING id INTO comment2_id;
  
  INSERT INTO comments (id, content, user_id, content_id, content_type, created_at, updated_at, parent_id, depth) 
  VALUES (uuid_generate_v4(), 'I use Ableton Live for most of my production work.', user2_id, forum_topic3_id, 'forum_topic', NOW(), NOW(), NULL, 0)
  RETURNING id INTO comment3_id;
  
  INSERT INTO comments (id, content, user_id, content_id, content_type, created_at, updated_at, parent_id, depth) 
  VALUES (uuid_generate_v4(), 'FL Studio has been my go-to for years.', user3_id, forum_topic3_id, 'forum_topic', NOW(), NOW(), NULL, 0)
  RETURNING id INTO comment4_id;
  
  INSERT INTO comments (id, content, user_id, content_id, content_type, created_at, updated_at, parent_id, depth) 
  VALUES (uuid_generate_v4(), 'I find clear communication is key for successful collaborations.', user4_id, forum_topic2_id, 'forum_topic', NOW(), NOW(), NULL, 0)
  RETURNING id INTO comment5_id;

  -- Insert followers
  INSERT INTO followers (follower_id, followed_id, created_at) 
  VALUES (user1_id, user2_id, NOW());
  
  INSERT INTO followers (follower_id, followed_id, created_at) 
  VALUES (user2_id, user1_id, NOW());
  
  INSERT INTO followers (follower_id, followed_id, created_at) 
  VALUES (user3_id, user1_id, NOW());
  
  INSERT INTO followers (follower_id, followed_id, created_at) 
  VALUES (user4_id, user2_id, NOW());
  
  INSERT INTO followers (follower_id, followed_id, created_at) 
  VALUES (user1_id, user3_id, NOW());

  -- Insert collaborators
  INSERT INTO collaborators (musician_id, requester_id, status, created_at, updated_at) 
  VALUES (musician1_id, user2_id, 'accepted', NOW(), NOW());
  
  INSERT INTO collaborators (musician_id, requester_id, status, created_at, updated_at) 
  VALUES (musician2_id, user3_id, 'pending', NOW(), NOW());
  
  INSERT INTO collaborators (musician_id, requester_id, status, created_at, updated_at) 
  VALUES (musician3_id, user1_id, 'accepted', NOW(), NOW());

  -- Insert songs
  INSERT INTO songs (id, title, url, musician_id, created_at, updated_at) 
  VALUES (uuid_generate_v4(), 'Summer Vibes', 'https://example.com/songs/summer-vibes.mp3', musician1_id, NOW(), NOW())
  RETURNING id INTO song1_id;
  
  INSERT INTO songs (id, title, url, musician_id, created_at, updated_at) 
  VALUES (uuid_generate_v4(), 'Midnight Dreams', 'https://example.com/songs/midnight-dreams.mp3', musician2_id, NOW(), NOW())
  RETURNING id INTO song2_id;
  
  INSERT INTO songs (id, title, url, musician_id, created_at, updated_at) 
  VALUES (uuid_generate_v4(), 'Jazz Improv #3', 'https://example.com/songs/jazz-improv-3.mp3', musician3_id, NOW(), NOW())
  RETURNING id INTO song3_id;

  -- Insert videos
  INSERT INTO videos (id, title, url, platform, musician_id, created_at, updated_at) 
  VALUES (uuid_generate_v4(), 'Live at The Venue', 'https://youtube.com/watch?v=example1', 'youtube', musician1_id, NOW(), NOW())
  RETURNING id INTO video1_id;
  
  INSERT INTO videos (id, title, url, platform, musician_id, created_at, updated_at) 
  VALUES (uuid_generate_v4(), 'Studio Session', 'https://youtube.com/watch?v=example2', 'youtube', musician2_id, NOW(), NOW())
  RETURNING id INTO video2_id;

  -- Insert featured content
  INSERT INTO featured_content (id, musician_id, content_id, content_type, display_order, created_at, updated_at) 
  VALUES (uuid_generate_v4(), musician1_id, song1_id, 'song', 1, NOW(), NOW());
  
  INSERT INTO featured_content (id, musician_id, content_id, content_type, display_order, created_at, updated_at) 
  VALUES (uuid_generate_v4(), musician1_id, video1_id, 'video', 2, NOW(), NOW());
  
  INSERT INTO featured_content (id, musician_id, content_id, content_type, display_order, created_at, updated_at) 
  VALUES (uuid_generate_v4(), musician2_id, song2_id, 'song', 1, NOW(), NOW());

  -- Insert notifications
  INSERT INTO notifications (id, type, actor_id, recipient_id, reference_id, read, created_at) 
  VALUES (uuid_generate_v4(), 'follow', user1_id, user2_id, NULL, FALSE, NOW());
  
  INSERT INTO notifications (id, type, actor_id, recipient_id, reference_id, read, created_at) 
  VALUES (uuid_generate_v4(), 'collaboration_request', user3_id, user2_id, musician2_id, FALSE, NOW());
  
  INSERT INTO notifications (id, type, actor_id, recipient_id, reference_id, read, created_at) 
  VALUES (uuid_generate_v4(), 'song_reaction', user4_id, user1_id, song1_id, TRUE, NOW());

  -- Insert nudges
  INSERT INTO nudges (id, sender_id, recipient_id, message, is_read, created_at) 
  VALUES (uuid_generate_v4(), user1_id, user2_id, 'Hey, would you be interested in collaborating on a new track?', FALSE, NOW());
  
  INSERT INTO nudges (id, sender_id, recipient_id, message, is_read, created_at) 
  VALUES (uuid_generate_v4(), user2_id, user1_id, 'I loved your latest song! Let''s chat about it.', TRUE, NOW());

  -- Insert song reactions
  INSERT INTO song_reactions (id, user_id, song_id, reaction_type, created_at) 
  VALUES (uuid_generate_v4(), user2_id, song1_id, 'like', NOW());
  
  INSERT INTO song_reactions (id, user_id, song_id, reaction_type, created_at) 
  VALUES (uuid_generate_v4(), user3_id, song1_id, 'love', NOW());
  
  INSERT INTO song_reactions (id, user_id, song_id, reaction_type, created_at) 
  VALUES (uuid_generate_v4(), user4_id, song2_id, 'like', NOW());
END $$;
