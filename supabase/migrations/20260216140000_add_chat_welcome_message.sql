
ALTER TABLE profiles ADD COLUMN chat_welcome_message TEXT;

-- Update existing profiles with a default welcome message if not set
UPDATE profiles 
SET chat_welcome_message = 'Hello! I am your AI assistant. How can I help you today?' 
WHERE chat_welcome_message IS NULL;
