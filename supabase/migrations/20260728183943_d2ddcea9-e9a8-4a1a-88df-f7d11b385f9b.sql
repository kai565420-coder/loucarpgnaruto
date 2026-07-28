DROP POLICY IF EXISTS "Sheet owners manage character jutsus insert" ON public.character_jutsus;
DROP POLICY IF EXISTS "Sheet owners manage character jutsus update" ON public.character_jutsus;
DROP POLICY IF EXISTS "Sheet owners manage character jutsus delete" ON public.character_jutsus;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.character_jutsus TO anon, authenticated;
GRANT ALL ON public.character_jutsus TO service_role;

CREATE POLICY "Owners manage character jutsus insert"
ON public.character_jutsus
FOR INSERT
TO anon, authenticated
WITH CHECK (public.owns_sheet(character_id));

CREATE POLICY "Owners manage character jutsus update"
ON public.character_jutsus
FOR UPDATE
TO anon, authenticated
USING (public.owns_sheet(character_id))
WITH CHECK (public.owns_sheet(character_id));

CREATE POLICY "Owners manage character jutsus delete"
ON public.character_jutsus
FOR DELETE
TO anon, authenticated
USING (public.owns_sheet(character_id));