ALTER TABLE public.character_sheets
  ADD COLUMN IF NOT EXISTS afinidade_fogo integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS dominio_fogo integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS afinidade_vento integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS dominio_vento integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS afinidade_raio integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS dominio_raio integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS afinidade_terra integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS dominio_terra integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS afinidade_agua integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS dominio_agua integer NOT NULL DEFAULT 0;