-- Up migration
ALTER TABLE profiles
ADD COLUMN bio TEXT;

-- Down migration
ALTER TABLE profiles
DROP COLUMN bio;
