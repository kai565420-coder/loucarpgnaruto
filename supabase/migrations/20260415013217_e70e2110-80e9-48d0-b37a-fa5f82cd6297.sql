
-- Change peso from integer to numeric in items
ALTER TABLE public.items ALTER COLUMN peso TYPE numeric USING peso::numeric;

-- Create personalizados table (same structure as items, admin-only visibility)
CREATE TABLE public.personalizados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  valor TEXT NOT NULL DEFAULT '',
  peso NUMERIC NOT NULL DEFAULT 0,
  imagem_url TEXT DEFAULT '',
  ip_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.personalizados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view personalizados" ON public.personalizados FOR SELECT USING (true);
CREATE POLICY "Anyone can insert personalizados" ON public.personalizados FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update personalizados" ON public.personalizados FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete personalizados" ON public.personalizados FOR DELETE USING (true);

-- Add dinheiro column to character_sheets
ALTER TABLE public.character_sheets ADD COLUMN dinheiro NUMERIC NOT NULL DEFAULT 0;

-- Add selos_manuais column to character_sheets (comma-separated text)
ALTER TABLE public.character_sheets ADD COLUMN selos_manuais TEXT NOT NULL DEFAULT '';

-- Add is_papel_lacrado to character_bag_items
ALTER TABLE public.character_bag_items ADD COLUMN is_papel_lacrado BOOLEAN NOT NULL DEFAULT false;

-- Add categoria to jutsus
ALTER TABLE public.jutsus ADD COLUMN categoria TEXT NOT NULL DEFAULT 'jutsu';
