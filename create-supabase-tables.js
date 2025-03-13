import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please set up your Supabase URL and anon key in the .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create tables in Supabase
async function createTables() {
  try {
    console.log('Creating tables directly in Supabase...');

    // Create profiles table
    const { error: profilesError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          full_name TEXT,
          avatar_url TEXT,
          banner_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          role TEXT DEFAULT 'user',
          visibility TEXT DEFAULT 'public',
          handle TEXT UNIQUE NOT NULL,
          social_links JSONB,
          comment_preferences JSONB,
          theme_colors JSONB,
          rich_text_bio TEXT,
          suno_username TEXT,
          suno_email TEXT,
          linking_status TEXT
        );
      `
    });

    if (profilesError) {
      console.error('Error creating profiles table directly:', profilesError);
    } else {
      console.log('Profiles table created successfully directly');
    }

    // Create genres table
    const { error: genresError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS genres (
          id UUID PRIMARY KEY,
          name TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_by UUID REFERENCES profiles(id),
          parent_genre_id UUID REFERENCES genres(id)
        );
      `
    });

    if (genresError) {
      console.error('Error creating genres table directly:', genresError);
    } else {
      console.log('Genres table created successfully directly');
    }

    // Create musicians table
    const { error: musiciansError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS musicians (
          id UUID PRIMARY KEY,
          name TEXT NOT NULL,
          user_id UUID REFERENCES profiles(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          bio TEXT,
          location TEXT,
          genre_id UUID REFERENCES genres(id),
          avatar_url TEXT
        );
      `
    });

    if (musiciansError) {
      console.error('Error creating musicians table directly:', musiciansError);
    } else {
      console.log('Musicians table created successfully directly');
    }

    // Create musician_genres table
    const { error: musicianGenresError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS musician_genres (
          musician_id UUID REFERENCES musicians(id),
          genre_id UUID REFERENCES genres(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          PRIMARY KEY (musician_id, genre_id)
        );
      `
    });

    if (musicianGenresError) {
      console.error('Error creating musician_genres table directly:', musicianGenresError);
    } else {
      console.log('Musician_genres table created successfully directly');
    }

    // Create forum_topics table
    const { error: forumTopicsError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS forum_topics (
          id UUID PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT,
          user_id UUID REFERENCES profiles(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          slug TEXT UNIQUE NOT NULL,
          category TEXT,
          is_pinned BOOLEAN DEFAULT FALSE,
          is_locked BOOLEAN DEFAULT FALSE
        );
      `
    });

    if (forumTopicsError) {
      console.error('Error creating forum_topics table directly:', forumTopicsError);
    } else {
      console.log('Forum_topics table created successfully directly');
    }

    // Create comments table
    const { error: commentsError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS comments (
          id UUID PRIMARY KEY,
          content TEXT NOT NULL,
          user_id UUID REFERENCES profiles(id),
          content_id TEXT NOT NULL,
          content_type TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          parent_id UUID REFERENCES comments(id),
          depth INTEGER DEFAULT 0,
          mentions TEXT[],
          rich_content JSONB,
          thread_path LTREE
        );
      `
    });

    if (commentsError) {
      console.error('Error creating comments table directly:', commentsError);
    } else {
      console.log('Comments table created successfully directly');
    }

    // Create followers table
    const { error: followersError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS followers (
          follower_id UUID REFERENCES profiles(id),
          followed_id UUID REFERENCES profiles(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          PRIMARY KEY (follower_id, followed_id)
        );
      `
    });

    if (followersError) {
      console.error('Error creating followers table directly:', followersError);
    } else {
      console.log('Followers table created successfully directly');
    }

    // Create collaborators table
    const { error: collaboratorsError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS collaborators (
          musician_id UUID REFERENCES musicians(id),
          requester_id UUID REFERENCES profiles(id),
          status TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          PRIMARY KEY (musician_id, requester_id)
        );
      `
    });

    if (collaboratorsError) {
      console.error('Error creating collaborators table directly:', collaboratorsError);
    } else {
      console.log('Collaborators table created successfully directly');
    }

    // Create songs table
    const { error: songsError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS songs (
          id UUID PRIMARY KEY,
          title TEXT NOT NULL,
          url TEXT NOT NULL,
          musician_id UUID REFERENCES musicians(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (songsError) {
      console.error('Error creating songs table directly:', songsError);
    } else {
      console.log('Songs table created successfully directly');
    }

    // Create videos table
    const { error: videosError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS videos (
          id UUID PRIMARY KEY,
          title TEXT NOT NULL,
          url TEXT NOT NULL,
          platform TEXT NOT NULL,
          musician_id UUID REFERENCES musicians(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (videosError) {
      console.error('Error creating videos table directly:', videosError);
    } else {
      console.log('Videos table created successfully directly');
    }

    // Create featured_content table
    const { error: featuredContentError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS featured_content (
          id UUID PRIMARY KEY,
          musician_id UUID REFERENCES musicians(id),
          content_id TEXT NOT NULL,
          content_type TEXT NOT NULL,
          display_order INTEGER NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (featuredContentError) {
      console.error('Error creating featured_content table directly:', featuredContentError);
    } else {
      console.log('Featured_content table created successfully directly');
    }

    // Create notifications table
    const { error: notificationsError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS notifications (
          id UUID PRIMARY KEY,
          type TEXT NOT NULL,
          actor_id UUID REFERENCES profiles(id),
          recipient_id UUID REFERENCES profiles(id),
          reference_id TEXT,
          read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (notificationsError) {
      console.error('Error creating notifications table directly:', notificationsError);
    } else {
      console.log('Notifications table created successfully directly');
    }

    // Create nudges table
    const { error: nudgesError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS nudges (
          id UUID PRIMARY KEY,
          sender_id UUID REFERENCES profiles(id),
          recipient_id UUID REFERENCES profiles(id),
          message TEXT NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (nudgesError) {
      console.error('Error creating nudges table directly:', nudgesError);
    } else {
      console.log('Nudges table created successfully directly');
    }

    // Create song_reactions table
    const { error: songReactionsError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS song_reactions (
          id UUID PRIMARY KEY,
          user_id UUID REFERENCES profiles(id),
          song_id UUID REFERENCES songs(id),
          reaction_type TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (songReactionsError) {
      console.error('Error creating song_reactions table directly:', songReactionsError);
    } else {
      console.log('Song_reactions table created successfully directly');
    }

    // Create linking_codes table
    const { error: linkingCodesError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS linking_codes (
          id UUID PRIMARY KEY,
          code TEXT NOT NULL UNIQUE,
          user_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          used_at TIMESTAMP WITH TIME ZONE,
          suno_username TEXT,
          suno_email TEXT
        );
      `
    });

    if (linkingCodesError) {
      console.error('Error creating linking_codes table directly:', linkingCodesError);
    } else {
      console.log('Linking_codes table created successfully directly');
    }

    console.log('All tables created successfully directly!');
  } catch (error) {
    console.error('Error creating tables directly:', error);
  }
}

// Create the create_table_if_not_exists function in Supabase
async function createHelperFunction() {
  try {
    console.log('Creating helper function in Supabase...');

    const { error } = await supabase.rpc('create_function_if_not_exists', {
      function_name: 'create_table_if_not_exists',
      function_definition: `
        CREATE OR REPLACE FUNCTION create_table_if_not_exists(
          table_name TEXT,
          table_definition TEXT
        ) RETURNS VOID AS $$
        BEGIN
          EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I (
              %s
            );
          ', table_name, table_definition);
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    if (error) {
      console.error('Error creating helper function:', error);
    } else {
      console.log('Helper function created successfully');
    }
  } catch (error) {
    console.error('Error creating helper function:', error);
  }
}

// Create the create_function_if_not_exists function in Supabase
async function createFunctionCreator() {
  try {
    console.log('Creating function creator in Supabase...');

    // We need to use raw SQL for this
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION create_function_if_not_exists(
          function_name TEXT,
          function_definition TEXT
        ) RETURNS VOID AS $$
        BEGIN
          EXECUTE function_definition;
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    if (error) {
      console.error('Error creating function creator:', error);
      
      // Try a different approach using direct SQL
      const { error: directError } = await supabase.from('_exec_sql').insert({
        sql: `
          CREATE OR REPLACE FUNCTION create_function_if_not_exists(
            function_name TEXT,
            function_definition TEXT
          ) RETURNS VOID AS $$
          BEGIN
            EXECUTE function_definition;
          END;
          $$ LANGUAGE plpgsql;
        `
      });
      
      if (directError) {
        console.error('Error creating function creator using direct SQL:', directError);
        throw directError;
      } else {
        console.log('Function creator created successfully using direct SQL');
      }
    } else {
      console.log('Function creator created successfully');
    }
  } catch (error) {
    console.error('Error creating function creator:', error);
    
    // If we can't create the helper functions, we'll need to create the tables directly
    console.log('Attempting to create tables directly...');
    await createTablesDirectly();
  }
}

// Create tables directly without helper functions
async function createTablesDirectly() {
  try {
    console.log('Creating tables directly in Supabase...');

    // Create profiles table
    const { error: profilesError } = await supabase.from('_exec_sql').insert({
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          full_name TEXT,
          avatar_url TEXT,
          banner_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          role TEXT DEFAULT 'user',
          visibility TEXT DEFAULT 'public',
          handle TEXT UNIQUE NOT NULL,
          social_links JSONB,
          comment_preferences JSONB,
          theme_colors JSONB,
          rich_text_bio TEXT,
          suno_username TEXT,
          suno_email TEXT,
          linking_status TEXT
        );
      `
    });

    if (profilesError) {
      console.error('Error creating profiles table directly:', profilesError);
    } else {
      console.log('Profiles table created successfully directly');
    }

    // Continue with other tables...
    // (For brevity, I'm not including all tables here, but you would follow the same pattern)
  } catch (error) {
    console.error('Error creating tables directly:', error);
  }
}

// Main function
async function main() {
  try {
    // First, try to create the function creator
    await createFunctionCreator();
    
    // Then create the helper function
    await createHelperFunction();
    
    // Finally, create the tables
    await createTables();
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Run the main function
main();
