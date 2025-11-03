-- Fix PUBLIC_DATA_EXPOSURE: Require authentication to view donations
-- This prevents public access to donor/recipient locations and movement patterns

DROP POLICY IF EXISTS "Anyone can view available donations" ON public.donations;

CREATE POLICY "Authenticated users can view available donations"
ON public.donations FOR SELECT
TO authenticated
USING (status = 'available' OR auth.uid() = (SELECT user_id FROM profiles WHERE id = donor_id) OR auth.uid() = (SELECT user_id FROM profiles WHERE id = accepted_by));