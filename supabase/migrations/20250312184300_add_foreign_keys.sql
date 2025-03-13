-- Add foreign key constraints
ALTER TABLE followers
ADD CONSTRAINT fk_follower_id
FOREIGN KEY (follower_id)
REFERENCES profiles (id)
ON DELETE CASCADE;

ALTER TABLE followers
ADD CONSTRAINT fk_followed_id
FOREIGN KEY (followee_id)
REFERENCES profiles (id)
ON DELETE CASCADE;

ALTER TABLE musicians
ADD CONSTRAINT fk_user_id
FOREIGN KEY (profile_id)
REFERENCES profiles (id)
ON DELETE CASCADE;

ALTER TABLE collaborators
ADD CONSTRAINT fk_requester_id
FOREIGN KEY (collaborator_id)
REFERENCES profiles (id)
ON DELETE CASCADE;

ALTER TABLE collaborators
ADD CONSTRAINT fk_musician_id
FOREIGN KEY (musician_id)
REFERENCES musicians (id)
ON DELETE CASCADE;
