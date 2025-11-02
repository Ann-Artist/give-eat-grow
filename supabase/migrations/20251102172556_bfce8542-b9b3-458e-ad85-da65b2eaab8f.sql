-- Fix 1: Privilege Escalation - Create secure user_roles table
-- Use existing user_role enum type

-- Create user_roles table that users CANNOT modify
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can only READ their roles, never modify
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- NO INSERT/UPDATE/DELETE policies for regular users!
-- Only service_role or admin functions can modify roles

-- Update has_role() function to use the secure table
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text = _role
  )
$$;

-- Prevent role updates in profiles table
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile (excluding role)"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  -- Ensure role cannot be changed
  AND role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
);

-- Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, role FROM public.profiles
ON CONFLICT (user_id, role) DO NOTHING;

-- Create admin function to assign roles securely
CREATE OR REPLACE FUNCTION public.assign_user_role(
  _user_id uuid,
  _role user_role
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only admins can assign roles
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;
  
  INSERT INTO user_roles (user_id, role, assigned_by)
  VALUES (_user_id, _role, auth.uid())
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Fix 2: Phone Number Exposure - Restrict profile access to authenticated users
DROP POLICY IF EXISTS "Public can view limited profile info" ON public.profiles;

CREATE POLICY "Authenticated users can view public profile info"
ON public.profiles FOR SELECT
TO authenticated
USING (true);