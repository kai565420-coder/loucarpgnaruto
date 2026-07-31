CREATE TABLE public.bingo_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  alcunha text NOT NULL DEFAULT '',
  imagem_url text DEFAULT '',
  vila_origem text NOT NULL DEFAULT '',
  vila_registro text NOT NULL DEFAULT '',
  afiliacao_atual text NOT NULL DEFAULT '',
  rank_ameaca text NOT NULL DEFAULT '',
  recompensa text NOT NULL DEFAULT '',
  instrucoes_captura text NOT NULL DEFAULT '',
  crimes_conhecidos text NOT NULL DEFAULT '',
  ultima_localizacao text NOT NULL DEFAULT '',
  tecnicas_conhecidas text NOT NULL DEFAULT '',
  afinidades_elementais text NOT NULL DEFAULT '',
  kekkei_genkai text NOT NULL DEFAULT '',
  invocacoes text NOT NULL DEFAULT '',
  estilo_combate text NOT NULL DEFAULT '',
  pontos_fortes text NOT NULL DEFAULT '',
  pontos_fracos text NOT NULL DEFAULT '',
  nivel_sigilo text NOT NULL DEFAULT '',
  situacao text NOT NULL DEFAULT 'ativo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bingo_entries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bingo_entries TO authenticated;
GRANT ALL ON public.bingo_entries TO service_role;

ALTER TABLE public.bingo_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bingo entries are publicly viewable" ON public.bingo_entries FOR SELECT USING (true);
CREATE POLICY "Anyone can insert bingo entries" ON public.bingo_entries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update bingo entries" ON public.bingo_entries FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete bingo entries" ON public.bingo_entries FOR DELETE TO anon, authenticated USING (true);

CREATE TRIGGER update_bingo_entries_updated_at BEFORE UPDATE ON public.bingo_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();