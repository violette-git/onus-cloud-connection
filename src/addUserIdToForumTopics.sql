-- Add user_id column to forum_topics table
ALTER TABLE forum_topics
ADD COLUMN user_id uuid;

-- Add foreign key constraint to forum_topics table
ALTER TABLE forum_topics
ADD CONSTRAINT fk_user_id
FOREIGN KEY (user_id)
REFERENCES profiles(id);
