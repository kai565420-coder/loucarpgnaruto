ALTER TABLE public.jutsus
  ADD COLUMN IF NOT EXISTS rank text NOT NULL DEFAULT 'C',
  ADD COLUMN IF NOT EXISTS efeito_base integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS genjutsu_efeitos jsonb NOT NULL DEFAULT '{"primarios":[],"secundarios":[]}'::jsonb;