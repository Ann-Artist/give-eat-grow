-- Fix storage policies to use folder-based ownership (user_id/filename structure)
-- Drop existing policies that don't properly check ownership
DROP POLICY IF EXISTS "Users can update their own donation photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own donation photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload donation photos" ON storage.objects;

-- Recreate INSERT policy with folder-based ownership check
CREATE POLICY "Authenticated users can upload to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'donation-photos' 
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create owner-restricted UPDATE policy using folder ownership
CREATE POLICY "Users can update their own donation photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'donation-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create owner-restricted DELETE policy using folder ownership
CREATE POLICY "Users can delete their own donation photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'donation-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);