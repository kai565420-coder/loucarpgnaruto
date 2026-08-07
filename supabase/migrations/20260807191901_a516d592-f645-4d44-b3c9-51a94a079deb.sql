CREATE TABLE public.campaign_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('normal', 'hard')),
    current_boss_index INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'won', 'lost')),
    reroll_used BOOLEAN DEFAULT FALSE,
    squad JSONB DEFAULT '[]'::JSONB,
    inventory JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_sessions TO anon;
GRANT ALL ON public.campaign_sessions TO service_role;

ALTER TABLE public.campaign_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage campaign sessions"
ON public.campaign_sessions
FOR ALL
USING (true)
WITH CHECK (true);
