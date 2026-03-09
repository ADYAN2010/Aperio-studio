
-- CMS content table: stores editable website content by section
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  content_key text NOT NULL,
  content_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_published boolean NOT NULL DEFAULT false,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  UNIQUE(section, content_key)
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read published content
CREATE POLICY "Anyone can read published content"
ON public.site_content FOR SELECT
USING (is_published = true);

-- Admins can do everything
CREATE POLICY "Admins can read all content"
ON public.site_content FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert content"
ON public.site_content FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update content"
ON public.site_content FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete content"
ON public.site_content FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for CMS images
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-images', 'cms-images', true);

-- Storage policies
CREATE POLICY "Anyone can view CMS images"
ON storage.objects FOR SELECT
USING (bucket_id = 'cms-images');

CREATE POLICY "Admins can upload CMS images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cms-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update CMS images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'cms-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete CMS images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cms-images' AND public.has_role(auth.uid(), 'admin'));
