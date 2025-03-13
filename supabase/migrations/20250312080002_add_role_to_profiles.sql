-- Add role column to profiles table
ALTER TABLE profiles
ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
