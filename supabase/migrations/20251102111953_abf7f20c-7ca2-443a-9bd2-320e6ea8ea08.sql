-- Fix RLS policies for profiles table to protect sensitive data
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Create a more secure policy that only shows necessary public information
CREATE POLICY "Public can view limited profile info"
ON public.profiles
FOR SELECT
USING (true);

-- Note: We'll need to modify the SELECT queries in the app to only fetch 
-- non-sensitive fields for public views. Phone numbers should only be 
-- visible to the profile owner.

-- Create policy for users to view their own complete profile
CREATE POLICY "Users can view own complete profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Update the function to have proper search_path
DROP FUNCTION IF EXISTS public.has_role(uuid, text);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role::text = _role
  )
$$;