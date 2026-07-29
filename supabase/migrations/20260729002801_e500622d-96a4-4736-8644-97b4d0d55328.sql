CREATE POLICY "Anonymous users can upload character images"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'character-images');