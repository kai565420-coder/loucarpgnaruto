ALTER TABLE public.jutsus
  ADD COLUMN IF NOT EXISTS custo_invocacao integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_vida_max integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_sanidade_max integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_chakra_max integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_forca_fisica integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_destreza integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_taijutsu integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_shurikenjutsu integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_reflexos_ninja integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_furtividade integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_kenjutsu integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_analise_combate integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_conhecimento_shinobi integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_conhecimento_clas integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_sabotagem integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_genjutsu integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_resistencia_genjutsu integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_concentracao integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_intimidacao integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_controle_chakra integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inv_moldagem_elemental integer NOT NULL DEFAULT 0;

ALTER TABLE public.character_jutsus
  ADD COLUMN IF NOT EXISTS inv_vida integer,
  ADD COLUMN IF NOT EXISTS inv_sanidade integer,
  ADD COLUMN IF NOT EXISTS inv_chakra integer;

CREATE TABLE IF NOT EXISTS public.invocacao_jutsus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_jutsu_id uuid NOT NULL,
  jutsu_id uuid NOT NULL,
  maestria_nivel text NOT NULL DEFAULT 'I',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.invocacao_jutsus TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invocacao_jutsus TO authenticated;
GRANT ALL ON public.invocacao_jutsus TO service_role;

ALTER TABLE public.invocacao_jutsus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view invocacao_jutsus" ON public.invocacao_jutsus FOR SELECT USING (true);
CREATE POLICY "Anyone can insert invocacao_jutsus" ON public.invocacao_jutsus FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update invocacao_jutsus" ON public.invocacao_jutsus FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete invocacao_jutsus" ON public.invocacao_jutsus FOR DELETE USING (true);