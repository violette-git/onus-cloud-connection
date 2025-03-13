-- SQL command to define the musicians table
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
