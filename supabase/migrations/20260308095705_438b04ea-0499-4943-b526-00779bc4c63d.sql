
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS session_id TEXT NOT NULL DEFAULT gen_random_uuid()::text;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender TEXT NOT NULL DEFAULT 'visitor';
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS business_name TEXT;
