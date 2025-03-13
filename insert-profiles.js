import sql from './db.js';

// Helper function to generate a UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper function to get a random item from an array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get a random number between min and max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random social links
function generateSocialLinks() {
  return JSON.stringify({
    instagram: Math.random() > 0.3 ? `https://instagram.com/user_${Math.floor(Math.random() * 10000)}` : '',
    youtube: Math.random() > 0.6 ? `https://youtube.com/channel/UC${Math.random().toString(36).substring(2, 15)}` : '',
    linkedin: Math.random() > 0.7 ? `https://linkedin.com/in/user-${Math.floor(Math.random() * 10000)}` : '',
    twitter: Math.random() > 0.5 ? `https://twitter.com/user_${Math.floor(Math.random() * 10000)}` : '',
    facebook: Math.random() > 0.8 ? `https://facebook.com/user.${Math.floor(Math.random() * 10000)}` : '',
    tiktok: Math.random() > 0.7 ? `https://tiktok.com/@user_${Math.floor(Math.random() * 10000)}` : ''
  });
}

// Generate random comment preferences
function generateCommentPreferences() {
  return JSON.stringify({
    allowComments: Math.random() > 0.2,
    allowReplies: Math.random() > 0.3,
    moderation: getRandomItem(['none', 'manual', 'auto'])
  });
}

// Generate random theme colors
function generateThemeColors() {
  const colors = [
    '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', 
    '#ec4899', '#06b6d4', '#84cc16', '#6366f1', '#14b8a6'
  ];
  
  return JSON.stringify({
    primary: getRandomItem(colors),
    secondary: getRandomItem(colors),
    accent: getRandomItem(colors)
  });
}

// First names for generating random names
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
  'David', 'Susan', 'Richard', 'Jessica', 'Joseph', 'Sarah', 'Thomas', 'Karen', 'Charles', 'Nancy',
  'Christopher', 'Lisa', 'Daniel', 'Margaret', 'Matthew', 'Betty', 'Anthony', 'Sandra', 'Mark', 'Ashley',
  'Donald', 'Dorothy', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Melissa', 'George', 'Deborah', 'Timothy', 'Stephanie'
];

// Last names for generating random names
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
  'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson',
  'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King',
  'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter',
  'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins'
];

// Locations for generating random locations
const locations = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
  'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'San Francisco, CA',
  'Charlotte, NC', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
  'Boston, MA', 'Nashville, TN', 'Baltimore, MD', 'Oklahoma City, OK', 'Portland, OR'
];

// Genres for musicians
const genres = [
  'Rock', 'Pop', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'Country',
  'R&B', 'Indie', 'Metal', 'Folk', 'Blues', 'Reggae', 'Punk', 'Soul',
  'Funk', 'Disco', 'House', 'Techno', 'Ambient', 'Trap', 'Dubstep'
];

// Generate a profile with a musician
async function generateProfile(index, isUser = false) {
  const userId = isUser ? 'mock-user-123' : generateUUID();
  const firstName = getRandomItem(firstNames);
  const lastName = getRandomItem(lastNames);
  const fullName = `${firstName} ${lastName}`;
  const username = isUser ? 'current_user' : `${firstName.toLowerCase()}${lastName.toLowerCase()}${getRandomNumber(1, 999)}`;
  const handle = username;
  const avatarUrl = `https://i.pravatar.cc/150?u=${username}`;
  const bannerUrl = Math.random() > 0.5 ? `https://picsum.photos/seed/${username}/1200/300` : null;
  const role = Math.random() > 0.9 ? 'admin' : 'user';
  const visibility = getRandomItem(['public', 'private', 'followers']);
  const socialLinks = generateSocialLinks();
  const commentPreferences = generateCommentPreferences();
  const themeColors = generateThemeColors();
  const richTextBio = Math.random() > 0.3 ? `Hi, I'm ${fullName}. I'm a musician based in ${getRandomItem(locations)}.` : null;
  
  try {
    // Insert the profile
    await sql`
      INSERT INTO profiles (
        id, username, full_name, avatar_url, banner_url, role, visibility, handle,
        social_links, comment_preferences, theme_colors, rich_text_bio
      ) VALUES (
        ${userId}, ${username}, ${fullName}, ${avatarUrl}, ${bannerUrl}, ${role}, ${visibility}, ${handle},
        ${socialLinks}, ${commentPreferences}, ${themeColors}, ${richTextBio}
      )
    `;
    
    console.log(`Inserted profile: ${fullName} (${username})`);
    
    // Create a musician for some profiles
    if (Math.random() > 0.5 || isUser) {
      const musicianId = generateUUID();
      const musicianName = Math.random() > 0.5 ? `${fullName} Music` : getRandomItem([
        'The Echoes', 'Midnight Serenade', 'Electric Dreams', 'Sonic Wave', 'Harmony Junction',
        'Rhythm Collective', 'Melody Makers', 'Sound Explorers', 'Beat Brigade', 'Tune Travelers'
      ]);
      const location = getRandomItem(locations);
      const bio = `${musicianName} is a ${getRandomItem(genres)} artist based in ${location}.`;
      
      // Insert the musician
      await sql`
        INSERT INTO musicians (
          id, name, user_id, bio, location
        ) VALUES (
          ${musicianId}, ${musicianName}, ${userId}, ${bio}, ${location}
        )
      `;
      
      console.log(`Inserted musician: ${musicianName}`);
      
      // Add some genres to the musician
      const genreCount = getRandomNumber(1, 3);
      for (let i = 0; i < genreCount; i++) {
        const genreName = getRandomItem(genres);
        
        // Check if the genre exists
        const existingGenres = await sql`SELECT id FROM genres WHERE name = ${genreName}`;
        let genreId;
        
        if (existingGenres.length > 0) {
          genreId = existingGenres[0].id;
        } else {
          genreId = generateUUID();
          await sql`INSERT INTO genres (id, name) VALUES (${genreId}, ${genreName})`;
          console.log(`Inserted genre: ${genreName}`);
        }
        
        // Add the genre to the musician
        try {
          await sql`INSERT INTO musician_genres (musician_id, genre_id) VALUES (${musicianId}, ${genreId})`;
          console.log(`Added genre ${genreName} to musician ${musicianName}`);
        } catch (error) {
          // Ignore duplicate entries
          if (!error.message.includes('UNIQUE constraint failed')) {
            console.error(`Error adding genre to musician: ${error.message}`);
          }
        }
      }
      
      // Add some songs to the musician
      const songCount = getRandomNumber(0, 5);
      for (let i = 0; i < songCount; i++) {
        const songId = generateUUID();
        const songTitle = getRandomItem([
          'Summer Vibes', 'Midnight Dreams', 'Electric Pulse', 'Harmony in Chaos', 'Rhythm of Life',
          'Echoes of Yesterday', 'Future Beats', 'Melancholy Melody', 'Urban Symphony', 'Country Roads',
          'Ocean Waves', 'Mountain High', 'Desert Wind', 'City Lights', 'Rainy Day'
        ]);
        const songUrl = `https://example.com/songs/${songTitle.toLowerCase().replace(/\s+/g, '-')}.mp3`;
        
        await sql`INSERT INTO songs (id, title, url, musician_id) VALUES (${songId}, ${songTitle}, ${songUrl}, ${musicianId})`;
        console.log(`Added song ${songTitle} to musician ${musicianName}`);
      }
      
      // Add some videos to the musician
      const videoCount = getRandomNumber(0, 3);
      for (let i = 0; i < videoCount; i++) {
        const videoId = generateUUID();
        const videoTitle = getRandomItem([
          'Live at The Venue', 'Studio Session', 'Music Video', 'Behind the Scenes', 'Interview',
          'Acoustic Cover', 'Festival Performance', 'Tour Diary', 'Collaboration', 'Unplugged'
        ]);
        const videoUrl = `https://youtube.com/watch?v=example${getRandomNumber(1000, 9999)}`;
        const platform = 'youtube';
        
        await sql`INSERT INTO videos (id, title, url, platform, musician_id) VALUES (${videoId}, ${videoTitle}, ${videoUrl}, ${platform}, ${musicianId})`;
        console.log(`Added video ${videoTitle} to musician ${musicianName}`);
      }
    }
    
    return userId;
  } catch (error) {
    console.error(`Error creating profile: ${error.message}`);
    throw error;
  }
}

// Create followers relationships
async function createFollowers(userIds) {
  for (const followerId of userIds) {
    // Each user follows 5-15 random users
    const followCount = getRandomNumber(5, 15);
    const shuffledIds = [...userIds].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < followCount; i++) {
      const followedId = shuffledIds[i];
      
      // Don't follow yourself
      if (followerId === followedId) continue;
      
      try {
        await sql`INSERT INTO followers (follower_id, followed_id) VALUES (${followerId}, ${followedId})`;
        console.log(`User ${followerId} is now following user ${followedId}`);
      } catch (error) {
        // Ignore duplicate entries
        if (!error.message.includes('UNIQUE constraint failed')) {
          console.error(`Error creating follower relationship: ${error.message}`);
        }
      }
    }
  }
}

// Create collaborator relationships
async function createCollaborators(userIds) {
  // Get all musicians
  const musicians = await sql`SELECT id, user_id FROM musicians`;
  
  for (const musician of musicians) {
    // Each musician has 1-5 collaborators
    const collaboratorCount = getRandomNumber(1, 5);
    const shuffledIds = [...userIds].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < collaboratorCount; i++) {
      const requesterId = shuffledIds[i];
      
      // Don't collaborate with yourself
      if (musician.user_id === requesterId) continue;
      
      const status = getRandomItem(['pending', 'accepted', 'rejected']);
      
      try {
        await sql`INSERT INTO collaborators (musician_id, requester_id, status) VALUES (${musician.id}, ${requesterId}, ${status})`;
        console.log(`User ${requesterId} is now a collaborator with musician ${musician.id} (${status})`);
      } catch (error) {
        // Ignore duplicate entries
        if (!error.message.includes('UNIQUE constraint failed')) {
          console.error(`Error creating collaborator relationship: ${error.message}`);
        }
      }
    }
  }
}

// Create notifications
async function createNotifications(userIds) {
  const notificationTypes = ['follow', 'collaboration_request', 'song_reaction'];
  
  for (const recipientId of userIds) {
    // Each user has 0-10 notifications
    const notificationCount = getRandomNumber(0, 10);
    
    for (let i = 0; i < notificationCount; i++) {
      const notificationId = generateUUID();
      const type = getRandomItem(notificationTypes);
      const actorId = getRandomItem(userIds.filter(id => id !== recipientId));
      const read = Math.random() > 0.5 ? 1 : 0;
      let referenceId = null;
      
      if (type === 'song_reaction') {
        // Get a random song
        const songs = await sql`SELECT id FROM songs LIMIT 10`;
        if (songs.length > 0) {
          referenceId = getRandomItem(songs).id;
        }
      } else if (type === 'collaboration_request') {
        // Get a random musician
        const musicians = await sql`SELECT id FROM musicians LIMIT 10`;
        if (musicians.length > 0) {
          referenceId = getRandomItem(musicians).id;
        }
      }
      
      await sql`
        INSERT INTO notifications (id, type, actor_id, recipient_id, reference_id, read)
        VALUES (${notificationId}, ${type}, ${actorId}, ${recipientId}, ${referenceId}, ${read})
      `;
      console.log(`Created ${type} notification for user ${recipientId}`);
    }
  }
}

// Create nudges (direct messages)
async function createNudges(userIds) {
  for (const senderId of userIds) {
    // Each user sends 0-5 nudges
    const nudgeCount = getRandomNumber(0, 5);
    const shuffledIds = [...userIds].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < nudgeCount; i++) {
      const recipientId = shuffledIds[i];
      
      // Don't send nudges to yourself
      if (senderId === recipientId) continue;
      
      const nudgeId = generateUUID();
      const message = getRandomItem([
        'Hey, would you be interested in collaborating on a new track?',
        'I loved your latest song! Let\'s chat about it.',
        'Are you going to the music festival next month?',
        'Just wanted to say hi and see how you\'re doing!',
        'I have a new project I\'d like to discuss with you.',
        'Your latest video was amazing! How did you shoot it?',
        'Do you have any tips for recording vocals?',
        'Would you be interested in doing a joint live stream?',
        'I\'m putting together a compilation album, would you like to be part of it?',
        'Just discovered your profile, your music is awesome!'
      ]);
      const isRead = Math.random() > 0.5 ? 1 : 0;
      
      await sql`
        INSERT INTO nudges (id, sender_id, recipient_id, message, is_read)
        VALUES (${nudgeId}, ${senderId}, ${recipientId}, ${message}, ${isRead})
      `;
      console.log(`Created nudge from user ${senderId} to user ${recipientId}`);
    }
  }
}

// Create song reactions
async function createSongReactions(userIds) {
  // Get all songs
  const songs = await sql`SELECT id FROM songs`;
  
  for (const userId of userIds) {
    // Each user reacts to 0-10 songs
    const reactionCount = getRandomNumber(0, 10);
    const shuffledSongs = [...songs].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < reactionCount && i < shuffledSongs.length; i++) {
      const songId = shuffledSongs[i].id;
      const reactionId = generateUUID();
      const reactionType = getRandomItem(['like', 'love', 'fire', 'wow']);
      
      try {
        await sql`
          INSERT INTO song_reactions (id, user_id, song_id, reaction_type)
          VALUES (${reactionId}, ${userId}, ${songId}, ${reactionType})
        `;
        console.log(`User ${userId} reacted with ${reactionType} to song ${songId}`);
      } catch (error) {
        // Ignore duplicate entries
        if (!error.message.includes('UNIQUE constraint failed')) {
          console.error(`Error creating song reaction: ${error.message}`);
        }
      }
    }
  }
}

// Main function to create all the data
async function main() {
  try {
    console.log('Starting to insert profiles and related data...');
    
    // Check if the mock user already exists
    const existingUser = await sql`SELECT * FROM profiles WHERE id = 'mock-user-123'`;
    if (existingUser.length > 0) {
      console.log('Mock user already exists, deleting it first...');
      await sql`DELETE FROM profiles WHERE id = 'mock-user-123'`;
    }
    
    // Create the current user's profile first
    console.log('Creating current user profile...');
    const currentUserId = await generateProfile(0, true);
    console.log(`Created current user profile with ID: ${currentUserId}`);
    
    // Create 50 other profiles
    console.log('Creating 50 additional profiles...');
    const userIds = [currentUserId];
    for (let i = 1; i <= 50; i++) {
      try {
        const userId = await generateProfile(i);
        console.log(`Created profile ${i}/50 with ID: ${userId}`);
        userIds.push(userId);
      } catch (error) {
        console.error(`Error creating profile ${i}:`, error);
      }
    }
    
    // Create relationships and interactions
    console.log('Creating follower relationships...');
    await createFollowers(userIds);
    
    console.log('Creating collaborator relationships...');
    await createCollaborators(userIds);
    
    console.log('Creating notifications...');
    await createNotifications(userIds);
    
    console.log('Creating nudges...');
    await createNudges(userIds);
    
    console.log('Creating song reactions...');
    await createSongReactions(userIds);
    
    console.log('Successfully inserted all profiles and related data!');
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    // Close the database connection
    sql.end();
  }
}

// Run the main function
main();
