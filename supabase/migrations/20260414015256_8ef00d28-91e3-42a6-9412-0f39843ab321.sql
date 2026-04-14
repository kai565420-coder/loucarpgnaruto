
-- Add deslocamento to character_sheets
ALTER TABLE public.character_sheets ADD COLUMN deslocamento integer NOT NULL DEFAULT 0;

-- Add bolsa_traseira_tamanho to character_sheets
ALTER TABLE public.character_sheets ADD COLUMN bolsa_traseira_tamanho text NOT NULL DEFAULT 'pequena';

-- Add peso to items
ALTER TABLE public.items ADD COLUMN peso integer NOT NULL DEFAULT 0;

-- Create character_bag_items table
CREATE TABLE public.character_bag_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id uuid NOT NULL REFERENCES public.character_sheets(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  bag_type text NOT NULL DEFAULT 'traseira',
  quantidade integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.character_bag_items ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view character_bag_items" ON public.character_bag_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert character_bag_items" ON public.character_bag_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update character_bag_items" ON public.character_bag_items FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete character_bag_items" ON public.character_bag_items FOR DELETE USING (true);
