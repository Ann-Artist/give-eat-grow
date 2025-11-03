-- Fix warn-level security issues

-- 1. Add DELETE policy for profiles table (profiles_no_delete_policy)
-- Users should be able to delete their own profile for privacy compliance
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);

-- 2. Fix function search_path mutable issue (SUPA_function_search_path_mutable)
-- The update_updated_at function is missing search_path setting
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;