-- Add columns to the profiles table
ALTER TABLE profiles
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT,
ADD COLUMN location TEXT,
ADD COLUMN website TEXT;
