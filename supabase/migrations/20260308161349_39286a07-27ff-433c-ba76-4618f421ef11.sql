
-- Add promo_code column to bookings table
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS promo_code text DEFAULT NULL;

-- Create a function to atomically consume a promo code
CREATE OR REPLACE FUNCTION public.consume_promo_code(_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _promo RECORD;
BEGIN
  -- Lock the row for update
  SELECT * INTO _promo
  FROM public.promo_codes
  WHERE code = _code AND is_active = true
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'This promo code has expired or reached its usage limit.');
  END IF;

  -- Check expiration
  IF _promo.expires_at IS NOT NULL AND _promo.expires_at < now() THEN
    UPDATE public.promo_codes SET is_active = false WHERE id = _promo.id;
    RETURN jsonb_build_object('success', false, 'message', 'This promo code has expired or reached its usage limit.');
  END IF;

  -- Check max uses
  IF _promo.max_uses IS NOT NULL AND _promo.usage_count >= _promo.max_uses THEN
    UPDATE public.promo_codes SET is_active = false WHERE id = _promo.id;
    RETURN jsonb_build_object('success', false, 'message', 'This promo code has expired or reached its usage limit.');
  END IF;

  -- Increment usage
  UPDATE public.promo_codes
  SET usage_count = usage_count + 1,
      is_active = CASE
        WHEN max_uses IS NOT NULL AND usage_count + 1 >= max_uses THEN false
        ELSE is_active
      END
  WHERE id = _promo.id;

  RETURN jsonb_build_object('success', true, 'message', 'Promo code consumed successfully.');
END;
$$;
