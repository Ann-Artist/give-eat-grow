-- Create storage bucket for donation photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('donation-photos', 'donation-photos', true);

-- Create RLS policies for donation photos
CREATE POLICY "Anyone can view donation photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'donation-photos');

CREATE POLICY "Authenticated users can upload donation photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'donation-photos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own donation photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'donation-photos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own donation photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'donation-photos' 
  AND auth.role() = 'authenticated'
);