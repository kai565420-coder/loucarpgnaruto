CREATE OR REPLACE FUNCTION public.owns_sheet(_sheet_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.character_sheets s
    WHERE s.id = _sheet_id
      AND (
        s.user_id IS NULL
        OR s.user_id = auth.uid()
        OR public.has_role(auth.uid(), 'admin')
      )
  )
$function$;