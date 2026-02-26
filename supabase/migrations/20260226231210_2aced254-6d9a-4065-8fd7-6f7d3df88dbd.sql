
ALTER TABLE public.character_sheets 
  ALTER COLUMN maestria_fogo TYPE text USING maestria_fogo::text,
  ALTER COLUMN maestria_vento TYPE text USING maestria_vento::text,
  ALTER COLUMN maestria_terra TYPE text USING maestria_terra::text,
  ALTER COLUMN maestria_agua TYPE text USING maestria_agua::text,
  ALTER COLUMN maestria_raio TYPE text USING maestria_raio::text;

ALTER TABLE public.character_sheets 
  ALTER COLUMN maestria_fogo SET DEFAULT '',
  ALTER COLUMN maestria_vento SET DEFAULT '',
  ALTER COLUMN maestria_terra SET DEFAULT '',
  ALTER COLUMN maestria_agua SET DEFAULT '',
  ALTER COLUMN maestria_raio SET DEFAULT '';

-- Add max columns for vida, sanidade, chakra
ALTER TABLE public.character_sheets 
  ADD COLUMN vida_max integer NOT NULL DEFAULT 0,
  ADD COLUMN sanidade_max integer NOT NULL DEFAULT 0,
  ADD COLUMN chakra_max integer NOT NULL DEFAULT 0;

-- Set existing max values to current values
UPDATE public.character_sheets SET vida_max = vida, sanidade_max = sanidade, chakra_max = chakra;
