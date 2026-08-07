ALTER TABLE public.campaign_sessions 
ADD COLUMN IF NOT EXISTS formacao TEXT DEFAULT 'Inteligente',
ADD COLUMN IF NOT EXISTS intensidade TEXT DEFAULT 'Média';
