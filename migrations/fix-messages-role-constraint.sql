-- Drop the old constraint if it exists
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_role_check;

-- Add the correct constraint allowing both 'user' and 'assistant'
ALTER TABLE messages ADD CONSTRAINT messages_role_check 
  CHECK (role IN ('user', 'assistant'));
