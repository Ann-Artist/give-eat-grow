-- Create function to delete expired donations
CREATE OR REPLACE FUNCTION public.delete_expired_donations()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count integer;
BEGIN
  -- Delete donations where created_at + expiry_hours has passed
  DELETE FROM public.donations
  WHERE status = 'available'
    AND created_at + (expiry_hours * interval '1 hour') < now();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Grant usage to postgres user
GRANT USAGE ON SCHEMA cron TO postgres;

-- Schedule the cleanup function to run every hour
SELECT cron.schedule(
  'delete-expired-donations',
  '0 * * * *',
  $$SELECT public.delete_expired_donations()$$
);