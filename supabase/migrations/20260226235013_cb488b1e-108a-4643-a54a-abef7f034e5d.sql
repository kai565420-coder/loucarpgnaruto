
-- Table for jutsus
CREATE TABLE public.jutsus (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  informacoes TEXT NOT NULL DEFAULT '',
  imagem_url TEXT DEFAULT '',
  ip_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Junction table for character-jutsu relationship
CREATE TABLE public.character_jutsus (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.character_sheets(id) ON DELETE CASCADE,
  jutsu_id UUID NOT NULL REFERENCES public.jutsus(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(character_id, jutsu_id)
);

-- RLS for jutsus
ALTER TABLE public.jutsus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view jutsus" ON public.jutsus FOR SELECT USING (true);
CREATE POLICY "Anyone can insert jutsus" ON public.jutsus FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update jutsus" ON public.jutsus FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete jutsus" ON public.jutsus FOR DELETE USING (true);

-- RLS for character_jutsus
ALTER TABLE public.character_jutsus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view character_jutsus" ON public.character_jutsus FOR SELECT USING (true);
CREATE POLICY "Anyone can insert character_jutsus" ON public.character_jutsus FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete character_jutsus" ON public.character_jutsus FOR DELETE USING (true);
