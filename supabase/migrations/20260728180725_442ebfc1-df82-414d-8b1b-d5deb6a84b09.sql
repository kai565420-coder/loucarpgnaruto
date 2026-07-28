-- 1. Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Ownership on character sheets + drop IP columns
ALTER TABLE public.character_sheets ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.character_sheets DROP COLUMN IF EXISTS ip_address;
ALTER TABLE public.jutsus DROP COLUMN IF EXISTS ip_address;
ALTER TABLE public.items DROP COLUMN IF EXISTS ip_address;
ALTER TABLE public.personalizados DROP COLUMN IF EXISTS ip_address;

CREATE OR REPLACE FUNCTION public.owns_sheet(_sheet_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.character_sheets s
    WHERE s.id = _sheet_id
      AND (s.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
$$;

-- 3. character_sheets policies
DROP POLICY IF EXISTS "Anyone can view character sheets" ON public.character_sheets;
DROP POLICY IF EXISTS "Anyone can insert character sheets" ON public.character_sheets;
DROP POLICY IF EXISTS "Anyone can update character sheets" ON public.character_sheets;
DROP POLICY IF EXISTS "Anyone can delete character sheets" ON public.character_sheets;

CREATE POLICY "Character sheets are publicly viewable"
ON public.character_sheets FOR SELECT USING (true);

CREATE POLICY "Users create their own character sheets"
ON public.character_sheets FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Owners or admins update character sheets"
ON public.character_sheets FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners or admins delete character sheets"
ON public.character_sheets FOR DELETE TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- 4. character_jutsus
DROP POLICY IF EXISTS "Anyone can view character_jutsus" ON public.character_jutsus;
DROP POLICY IF EXISTS "Anyone can insert character_jutsus" ON public.character_jutsus;
DROP POLICY IF EXISTS "Anyone can update character_jutsus" ON public.character_jutsus;
DROP POLICY IF EXISTS "Anyone can delete character_jutsus" ON public.character_jutsus;

CREATE POLICY "Character jutsus are publicly viewable"
ON public.character_jutsus FOR SELECT USING (true);

CREATE POLICY "Sheet owners manage character jutsus insert"
ON public.character_jutsus FOR INSERT TO authenticated
WITH CHECK (public.owns_sheet(character_id));

CREATE POLICY "Sheet owners manage character jutsus update"
ON public.character_jutsus FOR UPDATE TO authenticated
USING (public.owns_sheet(character_id))
WITH CHECK (public.owns_sheet(character_id));

CREATE POLICY "Sheet owners manage character jutsus delete"
ON public.character_jutsus FOR DELETE TO authenticated
USING (public.owns_sheet(character_id));

-- 5. character_bag_items
DROP POLICY IF EXISTS "Anyone can view character_bag_items" ON public.character_bag_items;
DROP POLICY IF EXISTS "Anyone can insert character_bag_items" ON public.character_bag_items;
DROP POLICY IF EXISTS "Anyone can update character_bag_items" ON public.character_bag_items;
DROP POLICY IF EXISTS "Anyone can delete character_bag_items" ON public.character_bag_items;

CREATE POLICY "Bag items are publicly viewable"
ON public.character_bag_items FOR SELECT USING (true);

CREATE POLICY "Sheet owners insert bag items"
ON public.character_bag_items FOR INSERT TO authenticated
WITH CHECK (public.owns_sheet(character_id));

CREATE POLICY "Sheet owners update bag items"
ON public.character_bag_items FOR UPDATE TO authenticated
USING (public.owns_sheet(character_id))
WITH CHECK (public.owns_sheet(character_id));

CREATE POLICY "Sheet owners delete bag items"
ON public.character_bag_items FOR DELETE TO authenticated
USING (public.owns_sheet(character_id));

-- 6. invocacao_jutsus (through character_jutsus -> sheet)
DROP POLICY IF EXISTS "Anyone can view invocacao_jutsus" ON public.invocacao_jutsus;
DROP POLICY IF EXISTS "Anyone can insert invocacao_jutsus" ON public.invocacao_jutsus;
DROP POLICY IF EXISTS "Anyone can update invocacao_jutsus" ON public.invocacao_jutsus;
DROP POLICY IF EXISTS "Anyone can delete invocacao_jutsus" ON public.invocacao_jutsus;

CREATE POLICY "Invocation jutsus are publicly viewable"
ON public.invocacao_jutsus FOR SELECT USING (true);

CREATE POLICY "Sheet owners insert invocation jutsus"
ON public.invocacao_jutsus FOR INSERT TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.character_jutsus cj
  WHERE cj.id = character_jutsu_id AND public.owns_sheet(cj.character_id)
));

CREATE POLICY "Sheet owners update invocation jutsus"
ON public.invocacao_jutsus FOR UPDATE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.character_jutsus cj
  WHERE cj.id = character_jutsu_id AND public.owns_sheet(cj.character_id)
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.character_jutsus cj
  WHERE cj.id = character_jutsu_id AND public.owns_sheet(cj.character_id)
));

CREATE POLICY "Sheet owners delete invocation jutsus"
ON public.invocacao_jutsus FOR DELETE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.character_jutsus cj
  WHERE cj.id = character_jutsu_id AND public.owns_sheet(cj.character_id)
));

-- 7. Catalog tables: public read, admin-only writes
DROP POLICY IF EXISTS "Anyone can view jutsus" ON public.jutsus;
DROP POLICY IF EXISTS "Anyone can insert jutsus" ON public.jutsus;
DROP POLICY IF EXISTS "Anyone can update jutsus" ON public.jutsus;
DROP POLICY IF EXISTS "Anyone can delete jutsus" ON public.jutsus;

CREATE POLICY "Jutsus are publicly viewable" ON public.jutsus FOR SELECT USING (true);
CREATE POLICY "Admins insert jutsus" ON public.jutsus FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update jutsus" ON public.jutsus FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete jutsus" ON public.jutsus FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can view items" ON public.items;
DROP POLICY IF EXISTS "Anyone can insert items" ON public.items;
DROP POLICY IF EXISTS "Anyone can update items" ON public.items;
DROP POLICY IF EXISTS "Anyone can delete items" ON public.items;

CREATE POLICY "Items are publicly viewable" ON public.items FOR SELECT USING (true);
CREATE POLICY "Admins insert items" ON public.items FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update items" ON public.items FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete items" ON public.items FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can view personalizados" ON public.personalizados;
DROP POLICY IF EXISTS "Anyone can insert personalizados" ON public.personalizados;
DROP POLICY IF EXISTS "Anyone can update personalizados" ON public.personalizados;
DROP POLICY IF EXISTS "Anyone can delete personalizados" ON public.personalizados;

CREATE POLICY "Personalizados are publicly viewable" ON public.personalizados FOR SELECT USING (true);
CREATE POLICY "Admins insert personalizados" ON public.personalizados FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update personalizados" ON public.personalizados FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete personalizados" ON public.personalizados FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 8. Grants
GRANT SELECT ON public.character_sheets, public.character_jutsus, public.character_bag_items,
  public.invocacao_jutsus, public.jutsus, public.items, public.personalizados TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.character_sheets, public.character_jutsus,
  public.character_bag_items, public.invocacao_jutsus, public.jutsus, public.items,
  public.personalizados TO authenticated;
GRANT ALL ON public.character_sheets, public.character_jutsus, public.character_bag_items,
  public.invocacao_jutsus, public.jutsus, public.items, public.personalizados TO service_role;

-- 9. Storage: no public listing, authenticated-only writes
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND (COALESCE(qual, '') LIKE '%character-images%' OR COALESCE(with_check, '') LIKE '%character-images%')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Authenticated users upload character images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'character-images' AND owner = auth.uid());

CREATE POLICY "Owners or admins update character images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'character-images' AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin')))
WITH CHECK (bucket_id = 'character-images' AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Owners or admins delete character images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'character-images' AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin')));