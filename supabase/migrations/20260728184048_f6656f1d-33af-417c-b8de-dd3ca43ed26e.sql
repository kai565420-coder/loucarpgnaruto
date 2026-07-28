CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE OR REPLACE FUNCTION public.owns_sheet(_sheet_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.character_sheets s
    WHERE s.id = _sheet_id
      AND (
        s.user_id IS NULL
        OR s.user_id = auth.uid()
        OR public.has_role(auth.uid(), 'admin')
      )
  )
$$;