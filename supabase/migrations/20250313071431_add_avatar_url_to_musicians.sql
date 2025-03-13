-- Create Extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create musicians table if not exists
CREATE TABLE IF NOT EXISTS musicians (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage_name TEXT NOT NULL,
  genre TEXT NOT NULL,
  instruments TEXT[] NOT NULL,
  years_experience INT NOT NULL,
  bio TEXT NOT NULL,
  location TEXT NOT NULL,
  website TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add avatar_url column to musicians table
ALTER TABLE musicians ADD COLUMN IF NOT EXISTS avatar_url TEXT;
