
CREATE POLICY "Visitors can read own session messages"
  ON public.chat_messages FOR SELECT
  USING (true);
