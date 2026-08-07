import { useState, useEffect } from "react";
import { BOSSES, CAMPAIGN_CHARACTERS, CAMPAIGN_REWARDS } from "@/data/campaignData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAdmin } from "@/contexts/AdminContext";

const CampaignMode = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"start" | "recruitment" | "battle" | "reward" | "gameover">("start");
  const [recruitmentStep, setRecruitmentStep] = useState(0);
  const [currentCards, setCurrentCards] = useState<any[]>([]);
  const [difficulty, setDifficulty] = useState<"normal" | "hard">("normal");

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const { data, error } = await supabase
        .from("campaign_sessions")
        .select("*")
        .eq("status", "active")
        .maybeSingle();

      if (data) {
        setSession(data);
        if (data.squad.length < 5) {
          setView("recruitment");
          generateCards();
        } else {
          setView("battle");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startCampaign = async (diff: "normal" | "hard") => {
    setDifficulty(diff);
    setLoading(true);
    const { data, error } = await supabase
      .from("campaign_sessions")
      .insert({
        difficulty: diff,
        squad: [],
        inventory: diff === "normal" ? [CAMPAIGN_REWARDS[Math.floor(Math.random() * CAMPAIGN_REWARDS.length)]] : [],
      })
      .select()
      .single();

    if (data) {
      setSession(data);
      setView("recruitment");
      generateCards();
    }
    setLoading(false);
  };

  const generateCards = () => {
    const cards = [];
    const shuffled = [...CAMPAIGN_CHARACTERS].sort(() => 0.5 - Math.random());
    for (let i = 0; i < 3; i++) {
      const char = shuffled[i];
      const version = char.versions[Math.floor(Math.random() * char.versions.length)];
      cards.push({ ...char, selectedVersion: version });
    }
    setCurrentCards(cards);
  };

  const selectCharacter = async (char: any) => {
    const newSquad = [...session.squad, char];
    const { data, error } = await supabase
      .from("campaign_sessions")
      .update({ squad: newSquad })
      .eq("id", session.id)
      .select()
      .single();

    if (data) {
      setSession(data);
      if (newSquad.length < 5) {
        generateCards();
      } else {
        setView("battle");
      }
    }
  };

  if (loading) return <div className="retro-panel p-8 text-center">Carregando Campanha...</div>;

  if (view === "start") {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto py-10">
        <h1 className="text-4xl font-black text-center mb-6 retro-title uppercase tracking-tighter italic">
          Modo <span className="text-accent">Campanha</span>
        </h1>
        <div className="retro-panel p-6 flex flex-col gap-4 bg-black/60">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Bem-vindo ao Modo Campanha. Monte seu squad de 5 combatentes através de recrutamento por cartas e derrote todos os 18 chefes até chegar ao lendário Caim.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button onClick={() => startCampaign("normal")} className="retro-button p-4 text-sm flex flex-col gap-2">
              <span className="text-accent font-bold">MODO NORMAL</span>
              <span className="text-[10px] text-muted-foreground">Ver Over e Habilidades. 1 Reroll. 1 Item inicial.</span>
            </button>
            <button onClick={() => startCampaign("hard")} className="retro-button p-4 text-sm flex flex-col gap-2 opacity-80 hover:opacity-100">
              <span className="text-destructive font-bold">MODO DIFÍCIL</span>
              <span className="text-[10px] text-muted-foreground">Informações ocultas. Sem Reroll. Sem itens iniciais.</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "recruitment") {
    return (
      <div className="flex flex-col gap-6 py-4">
        <div className="flex justify-between items-center px-4">
          <h2 className="retro-title text-xl">Recrutamento ({session.squad.length}/5)</h2>
          {session.difficulty === "normal" && !session.reroll_used && (
            <button className="retro-button px-3 py-1 text-xs">Usar Reroll</button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
          {currentCards.map((card, idx) => (
            <div key={idx} className="retro-panel p-4 flex flex-col gap-3 group hover:border-accent cursor-pointer transition-all" onClick={() => selectCharacter(card)}>
              <div className="aspect-[3/4] bg-muted relative overflow-hidden border border-border">
                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20 group-hover:opacity-40">🎴</div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 backdrop-blur-sm">
                  <div className="text-xs font-bold text-accent uppercase">{card.name}</div>
                  <div className="text-[9px] text-muted-foreground">{card.classification}</div>
                </div>
              </div>
              
              <div className="space-y-1">
                {session.difficulty === "normal" ? (
                  <>
                    <div className="flex justify-between text-[10px]">
                      <span>Over:</span>
                      <span className="text-accent font-mono">{card.selectedVersion.over}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span>Versão:</span>
                      <span className="text-muted-foreground">{card.selectedVersion.year}</span>
                    </div>
                    <div className="text-[9px] text-muted-foreground italic border-t border-border/50 pt-1 mt-1">
                      {card.skills}
                    </div>
                  </>
                ) : (
                  <div className="text-[10px] text-center text-muted-foreground py-2 italic">
                    Informações Ocultas
                  </div>
                )}
              </div>
              <button className="retro-button text-[10px] py-1 mt-auto group-hover:bg-accent group-hover:text-accent-foreground">ESCOLHER</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "battle") {
    const currentBoss = BOSSES[session.current_boss_index];
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="retro-panel p-4 bg-destructive/10 border-destructive/50">
            <h3 className="text-xs font-bold uppercase text-destructive mb-2 flex items-center gap-2">
              <span className="animate-pulse">⚠️</span> Batalha Atual: {currentBoss.name}
            </h3>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-2xl font-black italic uppercase tracking-tighter">{currentBoss.name}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Nível: {currentBoss.category}</div>
              </div>
              <div className="text-3xl font-mono text-destructive">OVER {currentBoss.over}</div>
            </div>
          </div>

          <div className="retro-panel flex-1 min-h-[400px] flex flex-col bg-black/40">
            <div className="border-b border-border p-2 flex justify-between bg-muted/30">
              <span className="text-[10px] font-bold uppercase">Log de Combate</span>
              <div className="flex gap-2">
                <button className="text-[9px] hover:text-accent underline">Lenta</button>
                <button className="text-[9px] text-accent font-bold">Normal</button>
                <button className="text-[9px] hover:text-accent underline">Rápida</button>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3 font-serif text-sm leading-relaxed text-muted-foreground italic">
                <p>O campo de batalha está silencioso. Seu squad se posiciona frente a {currentBoss.name}...</p>
                {/* Narrativa será implementada aqui */}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border">
              <Button className="w-full retro-button bg-accent text-accent-foreground font-bold italic py-6">
                INICIAR BATALHA
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="retro-panel p-4">
            <h4 className="text-[10px] font-bold uppercase mb-3 text-accent border-b border-accent/30 pb-1">Seu Squad</h4>
            <div className="space-y-2">
              {session.squad.map((char: any, i: number) => (
                <div key={i} className="flex items-center gap-2 p-2 border border-border/30 bg-black/20">
                  <div className="w-8 h-8 bg-muted border border-border flex items-center justify-center text-xs">👤</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold truncate uppercase">{char.name}</div>
                    <div className="h-1 bg-muted mt-1 overflow-hidden rounded-full">
                      <div className="h-full bg-green-500 w-[100%]"></div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-accent">{char.selectedVersion.over}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="retro-panel p-4">
            <h4 className="text-[10px] font-bold uppercase mb-3 text-accent border-b border-accent/30 pb-1">Estratégia</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-muted-foreground uppercase">Estilo</label>
                <select className="bg-black border border-border text-[10px] p-1">
                  <option>Inteligente</option>
                  <option>Agressivo</option>
                  <option>Defensivo</option>
                  <option>Pressão</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-muted-foreground uppercase">Intensidade</label>
                <select className="bg-black border border-border text-[10px] p-1">
                  <option>Média</option>
                  <option>Baixa</option>
                  <option>Alta</option>
                  <option>Super Alta</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CampaignMode;
