-- SQL query to describe the musicians table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name='musicians';
