ALTER TABLE public.character_sheets 
ADD COLUMN maestria_fogo integer NOT NULL DEFAULT 0,
ADD COLUMN maestria_vento integer NOT NULL DEFAULT 0,
ADD COLUMN maestria_terra integer NOT NULL DEFAULT 0,
ADD COLUMN maestria_agua integer NOT NULL DEFAULT 0,
ADD COLUMN maestria_raio integer NOT NULL DEFAULT 0,
ADD COLUMN inventario text NOT NULL DEFAULT '';