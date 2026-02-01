-- Fix 1: Remove overly permissive profiles SELECT policy
-- Users should only see their own profile OR limited info about users they interact with
DROP POLICY IF EXISTS "Authenticated users can view public profile info" ON public.profiles;

-- Create a more restrictive policy: users can view limited profile info of donors for donations
-- they're accepting, or of users who accepted their donations
CREATE POLICY "Users can view profiles they interact with"
ON public.profiles FOR SELECT
USING (
  -- Own profile
  auth.uid() = user_id
  OR
  -- Donors of donations user has accepted (show donor info to acceptor)
  id IN (
    SELECT donor_id FROM donations 
    WHERE accepted_by = (SELECT id FROM profiles WHERE user_id = auth.uid())
  )
  OR
  -- Users who accepted my donations (show acceptor info to donor)
  id IN (
    SELECT accepted_by FROM donations 
    WHERE donor_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
    AND accepted_by IS NOT NULL
  )
);

-- Fix 2: Update donations SELECT policy to hide precise location for available donations
-- Only show location/coordinates for own donations or accepted ones
DROP POLICY IF EXISTS "Authenticated users can view available donations" ON public.donations;

-- Create view for available donations with limited location data
CREATE OR REPLACE VIEW public.available_donations_public AS
SELECT 
  id,
  donor_id,
  food_type,
  quantity,
  servings,
  -- Only show approximate location (area name only, not full address)
  CASE 
    WHEN status = 'available' THEN split_part(location, ',', 1)  -- First part only (neighborhood)
    ELSE location
  END as location,
  -- Hide coordinates for available donations
  CASE WHEN status != 'available' THEN latitude ELSE NULL END as latitude,
  CASE WHEN status != 'available' THEN longitude ELSE NULL END as longitude,
  expiry_hours,
  description,
  photo_url,
  status,
  accepted_by,
  urgent,
  created_at,
  updated_at
FROM public.donations;

-- Create new RLS policy with better controls
CREATE POLICY "Users can view donations appropriately"
ON public.donations FOR SELECT
USING (
  -- Own donations (full access)
  auth.uid() = (SELECT user_id FROM profiles WHERE id = donor_id)
  OR
  -- Donations user accepted (full access)
  auth.uid() = (SELECT user_id FROM profiles WHERE id = accepted_by)
  OR
  -- Available donations (anyone authenticated can see, but code will use view for limited data)
  (status = 'available' AND auth.role() = 'authenticated')
);

-- Fix 3: Fix storage bucket policies - restrict update/delete to file owners
DROP POLICY IF EXISTS "Users can update their own donation photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own donation photos" ON storage.objects;

-- Create owner-restricted update policy
CREATE POLICY "Users can update their own donation photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'donation-photos' 
  AND auth.uid()::text = split_part(name, '-', 1)  -- File name starts with profile_id
);

-- Create owner-restricted delete policy  
CREATE POLICY "Users can delete their own donation photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'donation-photos' 
  AND auth.uid()::text = split_part(name, '-', 1)  -- File name starts with profile_id
);