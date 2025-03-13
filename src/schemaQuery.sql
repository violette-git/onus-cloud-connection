-- Get schema information for the profiles table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles';

-- Get schema information for the forum_topics table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'forum_topics';

-- Get foreign key constraints involving the profiles and forum_topics tables
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE 
    tc.constraint_type = 'FOREIGN KEY' AND
    (tc.table_name = 'profiles' OR tc.table_name = 'forum_topics');
