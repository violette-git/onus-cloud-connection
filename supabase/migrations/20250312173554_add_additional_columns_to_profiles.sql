-- Add additional columns to profiles table
ALTER TABLE profiles
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT,
ADD COLUMN location TEXT,
ADD COLUMN website TEXT;
