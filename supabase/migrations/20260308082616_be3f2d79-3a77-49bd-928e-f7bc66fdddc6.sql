-- Create messages table for contact form submissions
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  business_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website_type TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert messages (public contact form)
CREATE POLICY "Anyone can submit a message"
ON public.messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users (admins) can read messages
CREATE POLICY "Authenticated users can read messages"
ON public.messages
FOR SELECT
TO authenticated
USING (true);

-- Only authenticated users can update messages (status changes)
CREATE POLICY "Authenticated users can update messages"
ON public.messages
FOR UPDATE
TO authenticated
USING (true);

-- Only authenticated users can delete messages
CREATE POLICY "Authenticated users can delete messages"
ON public.messages
FOR DELETE
TO authenticated
USING (true);