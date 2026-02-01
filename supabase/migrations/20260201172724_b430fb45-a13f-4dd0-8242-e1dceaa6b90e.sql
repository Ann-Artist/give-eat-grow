-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view profiles they interact with" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own complete profile" ON public.profiles;

-- Create a simple, non-recursive SELECT policy
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Create a security definer function to get profile id by user_id (avoids recursion)
CREATE OR REPLACE FUNCTION public.get_profile_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- Allow authenticated users to view donor names on available donations
-- This is done via a separate policy that allows viewing profiles linked to donations
CREATE POLICY "Users can view donor profiles for available donations"
ON public.profiles
FOR SELECT
USING (
  id IN (
    SELECT donor_id FROM public.donations 
    WHERE status = 'available'
  )
  AND auth.role() = 'authenticated'
);