-- Fix the SECURITY DEFINER view issue by dropping it and using RLS directly
-- The view approach is not ideal - instead, we'll handle location masking in the application code
DROP VIEW IF EXISTS public.available_donations_public;