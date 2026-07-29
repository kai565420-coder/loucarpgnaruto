-- jutsus
DROP POLICY IF EXISTS "Admins insert jutsus" ON public.jutsus;
DROP POLICY IF EXISTS "Admins update jutsus" ON public.jutsus;
DROP POLICY IF EXISTS "Admins delete jutsus" ON public.jutsus;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jutsus TO anon, authenticated;
CREATE POLICY "Anyone can insert jutsus" ON public.jutsus FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update jutsus" ON public.jutsus FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete jutsus" ON public.jutsus FOR DELETE TO anon, authenticated USING (true);

-- items
DROP POLICY IF EXISTS "Admins insert items" ON public.items;
DROP POLICY IF EXISTS "Admins update items" ON public.items;
DROP POLICY IF EXISTS "Admins delete items" ON public.items;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.items TO anon, authenticated;
CREATE POLICY "Anyone can insert items" ON public.items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update items" ON public.items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete items" ON public.items FOR DELETE TO anon, authenticated USING (true);

-- personalizados
DROP POLICY IF EXISTS "Admins insert personalizados" ON public.personalizados;
DROP POLICY IF EXISTS "Admins update personalizados" ON public.personalizados;
DROP POLICY IF EXISTS "Admins delete personalizados" ON public.personalizados;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.personalizados TO anon, authenticated;
CREATE POLICY "Anyone can insert personalizados" ON public.personalizados FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update personalizados" ON public.personalizados FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete personalizados" ON public.personalizados FOR DELETE TO anon, authenticated USING (true);

-- character sheets (app has no login; owner column stays null)
DROP POLICY IF EXISTS "Users create their own character sheets" ON public.character_sheets;
DROP POLICY IF EXISTS "Owners or admins update character sheets" ON public.character_sheets;
DROP POLICY IF EXISTS "Owners or admins delete character sheets" ON public.character_sheets;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.character_sheets TO anon, authenticated;
CREATE POLICY "Anyone can insert character sheets" ON public.character_sheets FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update character sheets" ON public.character_sheets FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete character sheets" ON public.character_sheets FOR DELETE TO anon, authenticated USING (true);

-- bag items
DROP POLICY IF EXISTS "Sheet owners insert bag items" ON public.character_bag_items;
DROP POLICY IF EXISTS "Sheet owners update bag items" ON public.character_bag_items;
DROP POLICY IF EXISTS "Sheet owners delete bag items" ON public.character_bag_items;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.character_bag_items TO anon, authenticated;
CREATE POLICY "Anyone can insert bag items" ON public.character_bag_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update bag items" ON public.character_bag_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete bag items" ON public.character_bag_items FOR DELETE TO anon, authenticated USING (true);

-- character jutsus
DROP POLICY IF EXISTS "Owners manage character jutsus insert" ON public.character_jutsus;
DROP POLICY IF EXISTS "Owners manage character jutsus update" ON public.character_jutsus;
DROP POLICY IF EXISTS "Owners manage character jutsus delete" ON public.character_jutsus;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.character_jutsus TO anon, authenticated;
CREATE POLICY "Anyone can insert character jutsus" ON public.character_jutsus FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update character jutsus" ON public.character_jutsus FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete character jutsus" ON public.character_jutsus FOR DELETE TO anon, authenticated USING (true);

-- invocacao jutsus
DROP POLICY IF EXISTS "Sheet owners insert invocation jutsus" ON public.invocacao_jutsus;
DROP POLICY IF EXISTS "Sheet owners update invocation jutsus" ON public.invocacao_jutsus;
DROP POLICY IF EXISTS "Sheet owners delete invocation jutsus" ON public.invocacao_jutsus;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invocacao_jutsus TO anon, authenticated;
CREATE POLICY "Anyone can insert invocation jutsus" ON public.invocacao_jutsus FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update invocation jutsus" ON public.invocacao_jutsus FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete invocation jutsus" ON public.invocacao_jutsus FOR DELETE TO anon, authenticated USING (true);