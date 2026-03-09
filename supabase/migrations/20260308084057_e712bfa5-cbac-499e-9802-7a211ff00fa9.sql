
-- Fix messages table RLS policies to require authentication properly
DROP POLICY IF EXISTS "Authenticated users can delete messages" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can read messages" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can update messages" ON public.messages;

CREATE POLICY "Admins can read messages" ON public.messages
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update messages" ON public.messages
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete messages" ON public.messages
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
