-- Add username column to profiles table
ALTER TABLE profiles
ADD COLUMN username TEXT UNIQUE NOT NULL;
