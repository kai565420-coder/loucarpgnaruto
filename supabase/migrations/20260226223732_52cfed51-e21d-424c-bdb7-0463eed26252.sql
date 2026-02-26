
-- Create character sheets table (IP-based, no auth needed)
CREATE TABLE public.character_sheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  nome TEXT NOT NULL,
  idade TEXT NOT NULL DEFAULT '',
  elementos TEXT NOT NULL DEFAULT '',
  classe TEXT NOT NULL DEFAULT '',
  talento TEXT NOT NULL DEFAULT '',
  imagem_url TEXT DEFAULT '',
  
  -- Atributos Destaque
  vida INTEGER NOT NULL DEFAULT 0,
  sanidade INTEGER NOT NULL DEFAULT 0,
  forca_fisica INTEGER NOT NULL DEFAULT 0,
  destreza INTEGER NOT NULL DEFAULT 0,
  chakra INTEGER NOT NULL DEFAULT 0,
  
  -- FOR
  taijutsu INTEGER NOT NULL DEFAULT 0,
  forca_bruta INTEGER NOT NULL DEFAULT 0,
  imobilizacao INTEGER NOT NULL DEFAULT 0,
  
  -- AGI
  acrobacia INTEGER NOT NULL DEFAULT 0,
  furtividade INTEGER NOT NULL DEFAULT 0,
  shurikenjutsu INTEGER NOT NULL DEFAULT 0,
  kenjutsu INTEGER NOT NULL DEFAULT 0,
  reflexos_ninja INTEGER NOT NULL DEFAULT 0,
  iniciativa INTEGER NOT NULL DEFAULT 0,
  
  -- INT
  analise_combate INTEGER NOT NULL DEFAULT 0,
  estrategia_tatica INTEGER NOT NULL DEFAULT 0,
  conhecimento_shinobi INTEGER NOT NULL DEFAULT 0,
  conhecimento_clas INTEGER NOT NULL DEFAULT 0,
  fuinjutsu INTEGER NOT NULL DEFAULT 0,
  sabotagem INTEGER NOT NULL DEFAULT 0,
  
  -- MEN
  genjutsu INTEGER NOT NULL DEFAULT 0,
  resistencia_genjutsu INTEGER NOT NULL DEFAULT 0,
  concentracao INTEGER NOT NULL DEFAULT 0,
  intimidacao INTEGER NOT NULL DEFAULT 0,
  vontade_ninja INTEGER NOT NULL DEFAULT 0,
  
  -- CON
  fortitude INTEGER NOT NULL DEFAULT 0,
  resistencia_fisica INTEGER NOT NULL DEFAULT 0,
  recuperacao INTEGER NOT NULL DEFAULT 0,
  tolerancia_dor INTEGER NOT NULL DEFAULT 0,
  sobrevivencia INTEGER NOT NULL DEFAULT 0,
  
  -- CHA
  controle_chakra INTEGER NOT NULL DEFAULT 0,
  moldagem_elemental INTEGER NOT NULL DEFAULT 0,
  ninjutsu_medico INTEGER NOT NULL DEFAULT 0,
  sensorial INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.character_sheets ENABLE ROW LEVEL SECURITY;

-- Public read access (everyone can see all sheets)
CREATE POLICY "Anyone can view character sheets"
  ON public.character_sheets FOR SELECT
  USING (true);

-- Public insert (anyone can create)
CREATE POLICY "Anyone can insert character sheets"
  ON public.character_sheets FOR INSERT
  WITH CHECK (true);

-- Public update (edge function will validate IP)
CREATE POLICY "Anyone can update character sheets"
  ON public.character_sheets FOR UPDATE
  USING (true);

-- Public delete
CREATE POLICY "Anyone can delete character sheets"
  ON public.character_sheets FOR DELETE
  USING (true);

-- Create storage bucket for character images
INSERT INTO storage.buckets (id, name, public)
VALUES ('character-images', 'character-images', true);

CREATE POLICY "Anyone can view character images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'character-images');

CREATE POLICY "Anyone can upload character images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'character-images');

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_character_sheets_updated_at
  BEFORE UPDATE ON public.character_sheets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
