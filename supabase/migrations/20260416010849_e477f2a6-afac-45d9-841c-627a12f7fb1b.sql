CREATE POLICY "Anyone can update character_jutsus"
ON public.character_jutsus
FOR UPDATE
USING (true);