-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Add instruments column to musicians table
ALTER TABLE musicians
ADD COLUMN instruments TEXT[];
