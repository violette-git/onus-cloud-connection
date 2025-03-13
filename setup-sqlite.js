import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Create a new SQLite database file
const dbPath = path.join(process.cwd(), 'local.db');
console.log(`Creating SQLite database at: ${dbPath}`);

// Remove existing database file if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Removed existing database file');
}

// Create a new database connection
const db = new Database(dbPath);
console.log('Database connection established');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
function createTables() {
  try {
    // Create profiles table
    db.exec(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        full_name TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        role TEXT DEFAULT 'user',
        visibility TEXT DEFAULT 'public',
        handle TEXT UNIQUE NOT NULL
      )
    `);
    console.log('Profiles table created');

    // Create genres table
    db.exec(`
      CREATE TABLE IF NOT EXISTS genres (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        parent_genre_id TEXT,
        FOREIGN KEY (created_by) REFERENCES profiles(id),
        FOREIGN KEY (parent_genre_id) REFERENCES genres(id)
      )
    `);
    console.log('Genres table created');

    // Create musicians table
    db.exec(`
      CREATE TABLE IF NOT EXISTS musicians (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        bio TEXT,
        location TEXT,
        genre_id TEXT,
        FOREIGN KEY (user_id) REFERENCES profiles(id),
        FOREIGN KEY (genre_id) REFERENCES genres(id)
      )
    `);
    console.log('Musicians table created');

    // Create musician_genres table
    db.exec(`
      CREATE TABLE IF NOT EXISTS musician_genres (
        musician_id TEXT NOT NULL,
        genre_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (musician_id, genre_id),
        FOREIGN KEY (musician_id) REFERENCES musicians(id),
        FOREIGN KEY (genre_id) REFERENCES genres(id)
      )
    `);
    console.log('Musician_genres table created');

    // Create forum_topics table
    db.exec(`
      CREATE TABLE IF NOT EXISTS forum_topics (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        user_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        slug TEXT UNIQUE NOT NULL,
        category TEXT,
        is_pinned INTEGER DEFAULT 0,
        is_locked INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES profiles(id)
      )
    `);
    console.log('Forum_topics table created');

    // Create comments table
    db.exec(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        user_id TEXT NOT NULL,
        content_id TEXT NOT NULL,
        content_type TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        parent_id TEXT,
        depth INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES profiles(id),
        FOREIGN KEY (parent_id) REFERENCES comments(id)
      )
    `);
    console.log('Comments table created');

    // Create followers table
    db.exec(`
      CREATE TABLE IF NOT EXISTS followers (
        follower_id TEXT NOT NULL,
        followed_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (follower_id, followed_id),
        FOREIGN KEY (follower_id) REFERENCES profiles(id),
        FOREIGN KEY (followed_id) REFERENCES profiles(id)
      )
    `);
    console.log('Followers table created');

    // Create collaborators table
    db.exec(`
      CREATE TABLE IF NOT EXISTS collaborators (
        musician_id TEXT NOT NULL,
        requester_id TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (musician_id, requester_id),
        FOREIGN KEY (musician_id) REFERENCES musicians(id),
        FOREIGN KEY (requester_id) REFERENCES profiles(id)
      )
    `);
    console.log('Collaborators table created');

    // Create songs table
    db.exec(`
      CREATE TABLE IF NOT EXISTS songs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        musician_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (musician_id) REFERENCES musicians(id)
      )
    `);
    console.log('Songs table created');

    // Create videos table
    db.exec(`
      CREATE TABLE IF NOT EXISTS videos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        platform TEXT NOT NULL,
        musician_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (musician_id) REFERENCES musicians(id)
      )
    `);
    console.log('Videos table created');

    // Create featured_content table
    db.exec(`
      CREATE TABLE IF NOT EXISTS featured_content (
        id TEXT PRIMARY KEY,
        musician_id TEXT NOT NULL,
        content_id TEXT NOT NULL,
        content_type TEXT NOT NULL,
        display_order INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (musician_id) REFERENCES musicians(id)
      )
    `);
    console.log('Featured_content table created');

    // Create notifications table
    db.exec(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        actor_id TEXT NOT NULL,
        recipient_id TEXT NOT NULL,
        reference_id TEXT,
        read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (actor_id) REFERENCES profiles(id),
        FOREIGN KEY (recipient_id) REFERENCES profiles(id)
      )
    `);
    console.log('Notifications table created');

    // Create nudges table
    db.exec(`
      CREATE TABLE IF NOT EXISTS nudges (
        id TEXT PRIMARY KEY,
        sender_id TEXT NOT NULL,
        recipient_id TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES profiles(id),
        FOREIGN KEY (recipient_id) REFERENCES profiles(id)
      )
    `);
    console.log('Nudges table created');

    // Create song_reactions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS song_reactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        song_id TEXT NOT NULL,
        reaction_type TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES profiles(id),
        FOREIGN KEY (song_id) REFERENCES songs(id)
      )
    `);
    console.log('Song_reactions table created');

    // Create linking_codes table
    db.exec(`
      CREATE TABLE IF NOT EXISTS linking_codes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        used INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES profiles(id)
      )
    `);
    console.log('Linking_codes table created');

    return true;
  } catch (error) {
    console.error('Error creating tables:', error);
    return false;
  }
}

// Insert sample data
function insertSampleData() {
  try {
    // Helper function to generate a UUID
    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    // Insert sample profiles
    const user1Id = generateUUID();
    const user2Id = generateUUID();
    const user3Id = generateUUID();
    const user4Id = generateUUID();
    const adminId = generateUUID();

    const insertProfile = db.prepare(`
      INSERT INTO profiles (id, username, full_name, avatar_url, role, visibility, handle)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertProfile.run(user1Id, 'johndoe', 'John Doe', 'https://i.pravatar.cc/150?u=johndoe', 'user', 'public', 'johndoe');
    insertProfile.run(user2Id, 'janedoe', 'Jane Doe', 'https://i.pravatar.cc/150?u=janedoe', 'user', 'public', 'janedoe');
    insertProfile.run(user3Id, 'bobsmith', 'Bob Smith', 'https://i.pravatar.cc/150?u=bobsmith', 'user', 'public', 'bobsmith');
    insertProfile.run(user4Id, 'alicejones', 'Alice Jones', 'https://i.pravatar.cc/150?u=alicejones', 'user', 'public', 'alicejones');
    insertProfile.run(adminId, 'admin', 'Admin User', 'https://i.pravatar.cc/150?u=admin', 'admin', 'public', 'admin');
    console.log('Sample profiles inserted');

    // Insert sample genres
    const rockId = generateUUID();
    const popId = generateUUID();
    const hipHopId = generateUUID();
    const electronicId = generateUUID();
    const jazzId = generateUUID();
    const altRockId = generateUUID();
    const indiePopId = generateUUID();

    const insertGenre = db.prepare(`
      INSERT INTO genres (id, name, created_by, parent_genre_id)
      VALUES (?, ?, ?, ?)
    `);

    insertGenre.run(rockId, 'Rock', null, null);
    insertGenre.run(popId, 'Pop', null, null);
    insertGenre.run(hipHopId, 'Hip Hop', null, null);
    insertGenre.run(electronicId, 'Electronic', null, null);
    insertGenre.run(jazzId, 'Jazz', null, null);
    insertGenre.run(altRockId, 'Alternative Rock', null, rockId);
    insertGenre.run(indiePopId, 'Indie Pop', null, popId);
    console.log('Sample genres inserted');

    // Insert sample musicians
    const musician1Id = generateUUID();
    const musician2Id = generateUUID();
    const musician3Id = generateUUID();

    const insertMusician = db.prepare(`
      INSERT INTO musicians (id, name, user_id, bio, location, genre_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertMusician.run(musician1Id, 'John Doe Music', user1Id, 'Indie musician from Seattle', 'Seattle, WA', altRockId);
    insertMusician.run(musician2Id, 'Jane Doe Band', user2Id, 'Electronic music producer', 'Los Angeles, CA', electronicId);
    insertMusician.run(musician3Id, 'Bob Smith Jazz', user3Id, 'Jazz enthusiast and performer', 'New Orleans, LA', jazzId);
    console.log('Sample musicians inserted');

    // Insert sample musician_genres
    const insertMusicianGenre = db.prepare(`
      INSERT INTO musician_genres (musician_id, genre_id)
      VALUES (?, ?)
    `);

    insertMusicianGenre.run(musician1Id, altRockId);
    insertMusicianGenre.run(musician1Id, indiePopId);
    insertMusicianGenre.run(musician2Id, electronicId);
    insertMusicianGenre.run(musician3Id, jazzId);
    console.log('Sample musician_genres inserted');

    // Insert sample forum_topics
    const forumTopic1Id = generateUUID();
    const forumTopic2Id = generateUUID();
    const forumTopic3Id = generateUUID();
    const forumTopic4Id = generateUUID();

    const insertForumTopic = db.prepare(`
      INSERT INTO forum_topics (id, title, content, user_id, slug, category, is_pinned, is_locked)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertForumTopic.run(
      forumTopic1Id,
      'Welcome to the Onus Community',
      'This is the official welcome thread for all new members. Feel free to introduce yourself!',
      adminId,
      'welcome-to-the-onus-community',
      'General',
      1,
      0
    );
    insertForumTopic.run(
      forumTopic2Id,
      'Tips for Collaborating with Other Musicians',
      'Share your best practices for successful music collaborations.',
      user1Id,
      'tips-for-collaborating-with-other-musicians',
      'Collaboration',
      0,
      0
    );
    insertForumTopic.run(
      forumTopic3Id,
      'Favorite Music Production Software?',
      'What DAW or production software do you use and why?',
      user2Id,
      'favorite-music-production-software',
      'Production',
      0,
      0
    );
    insertForumTopic.run(
      forumTopic4Id,
      'Upcoming Virtual Music Events',
      'Let\'s share information about upcoming virtual concerts and music events.',
      user3Id,
      'upcoming-virtual-music-events',
      'Events',
      0,
      0
    );
    console.log('Sample forum_topics inserted');

    // Insert sample comments
    const comment1Id = generateUUID();
    const comment2Id = generateUUID();
    const comment3Id = generateUUID();
    const comment4Id = generateUUID();
    const comment5Id = generateUUID();

    const insertComment = db.prepare(`
      INSERT INTO comments (id, content, user_id, content_id, content_type, parent_id, depth)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertComment.run(
      comment1Id,
      'Welcome everyone! Excited to have you all here.',
      adminId,
      forumTopic1Id,
      'forum_topic',
      null,
      0
    );
    insertComment.run(
      comment2Id,
      'Thanks for the warm welcome!',
      user1Id,
      forumTopic1Id,
      'forum_topic',
      comment1Id,
      1
    );
    insertComment.run(
      comment3Id,
      'I use Ableton Live for most of my production work.',
      user2Id,
      forumTopic3Id,
      'forum_topic',
      null,
      0
    );
    insertComment.run(
      comment4Id,
      'FL Studio has been my go-to for years.',
      user3Id,
      forumTopic3Id,
      'forum_topic',
      null,
      0
    );
    insertComment.run(
      comment5Id,
      'I find clear communication is key for successful collaborations.',
      user4Id,
      forumTopic2Id,
      'forum_topic',
      null,
      0
    );
    console.log('Sample comments inserted');

    // Insert sample followers
    const insertFollower = db.prepare(`
      INSERT INTO followers (follower_id, followed_id)
      VALUES (?, ?)
    `);

    insertFollower.run(user1Id, user2Id);
    insertFollower.run(user2Id, user1Id);
    insertFollower.run(user3Id, user1Id);
    insertFollower.run(user4Id, user2Id);
    insertFollower.run(user1Id, user3Id);
    console.log('Sample followers inserted');

    // Insert sample collaborators
    const insertCollaborator = db.prepare(`
      INSERT INTO collaborators (musician_id, requester_id, status)
      VALUES (?, ?, ?)
    `);

    insertCollaborator.run(musician1Id, user2Id, 'accepted');
    insertCollaborator.run(musician2Id, user3Id, 'pending');
    insertCollaborator.run(musician3Id, user1Id, 'accepted');
    console.log('Sample collaborators inserted');

    // Insert sample songs
    const song1Id = generateUUID();
    const song2Id = generateUUID();
    const song3Id = generateUUID();

    const insertSong = db.prepare(`
      INSERT INTO songs (id, title, url, musician_id)
      VALUES (?, ?, ?, ?)
    `);

    insertSong.run(song1Id, 'Summer Vibes', 'https://example.com/songs/summer-vibes.mp3', musician1Id);
    insertSong.run(song2Id, 'Midnight Dreams', 'https://example.com/songs/midnight-dreams.mp3', musician2Id);
    insertSong.run(song3Id, 'Jazz Improv #3', 'https://example.com/songs/jazz-improv-3.mp3', musician3Id);
    console.log('Sample songs inserted');

    // Insert sample videos
    const video1Id = generateUUID();
    const video2Id = generateUUID();

    const insertVideo = db.prepare(`
      INSERT INTO videos (id, title, url, platform, musician_id)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertVideo.run(video1Id, 'Live at The Venue', 'https://youtube.com/watch?v=example1', 'youtube', musician1Id);
    insertVideo.run(video2Id, 'Studio Session', 'https://youtube.com/watch?v=example2', 'youtube', musician2Id);
    console.log('Sample videos inserted');

    // Insert sample featured_content
    const insertFeaturedContent = db.prepare(`
      INSERT INTO featured_content (id, musician_id, content_id, content_type, display_order)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertFeaturedContent.run(generateUUID(), musician1Id, song1Id, 'song', 1);
    insertFeaturedContent.run(generateUUID(), musician1Id, video1Id, 'video', 2);
    insertFeaturedContent.run(generateUUID(), musician2Id, song2Id, 'song', 1);
    console.log('Sample featured_content inserted');

    // Insert sample notifications
    const insertNotification = db.prepare(`
      INSERT INTO notifications (id, type, actor_id, recipient_id, reference_id, read)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertNotification.run(generateUUID(), 'follow', user1Id, user2Id, null, 0);
    insertNotification.run(generateUUID(), 'collaboration_request', user3Id, user2Id, musician2Id, 0);
    insertNotification.run(generateUUID(), 'song_reaction', user4Id, user1Id, song1Id, 1);
    console.log('Sample notifications inserted');

    // Insert sample nudges
    const insertNudge = db.prepare(`
      INSERT INTO nudges (id, sender_id, recipient_id, message, is_read)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertNudge.run(generateUUID(), user1Id, user2Id, 'Hey, would you be interested in collaborating on a new track?', 0);
    insertNudge.run(generateUUID(), user2Id, user1Id, 'I loved your latest song! Let\'s chat about it.', 1);
    console.log('Sample nudges inserted');

    // Insert sample song_reactions
    const insertSongReaction = db.prepare(`
      INSERT INTO song_reactions (id, user_id, song_id, reaction_type)
      VALUES (?, ?, ?, ?)
    `);

    insertSongReaction.run(generateUUID(), user2Id, song1Id, 'like');
    insertSongReaction.run(generateUUID(), user3Id, song1Id, 'love');
    insertSongReaction.run(generateUUID(), user4Id, song2Id, 'like');
    console.log('Sample song_reactions inserted');

    return true;
  } catch (error) {
    console.error('Error inserting sample data:', error);
    return false;
  }
}

// Create tables and insert sample data
createTables();
insertSampleData();

// Close the database connection
db.close();
console.log('Database setup complete');
