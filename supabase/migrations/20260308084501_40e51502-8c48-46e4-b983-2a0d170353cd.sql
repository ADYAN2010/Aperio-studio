
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  business_name text DEFAULT '',
  website_type text DEFAULT '',
  message text DEFAULT '',
  meeting_date date NOT NULL,
  meeting_time text NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a booking
CREATE POLICY "Anyone can insert bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

-- Only admins can read/update/delete bookings
CREATE POLICY "Admins can read bookings" ON public.bookings
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update bookings" ON public.bookings
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete bookings" ON public.bookings
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
