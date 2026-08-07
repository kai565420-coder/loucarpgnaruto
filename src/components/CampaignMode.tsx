import { useState, useEffect } from "react";
import { BOSSES, CAMPAIGN_CHARACTERS, CAMPAIGN_REWARDS } from "@/data/campaignData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CampaignSession {
  id: string;
  user_id: string | null;
  difficulty: "normal" | "hard";
  current_boss_index: number;
  status: "active" | "won" | "lost";
  reroll_used: boolean;
  squad: any[];
  inventory: any[];
  created_at: string;
  updated_at: string;
}

const CampaignMode = () => {
  const [session, setSession] = useState<CampaignSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"start" | "recruitment" | "battle" | "reward" | "gameover">("start");
  const [currentCards, setCurrentCards] = useState<any[]>([]);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [battleSpeed, setBattleSpeed] = useState<"lenta" | "normal" | "rapida" | "instant">("normal");
  const [rewardChoices, setRewardChoices] = useState<any[]>([]);
  const [selectedFormacao, setSelectedFormacao] = useState("Inteligente");
  const [selectedIntensidade, setSelectedIntensidade] = useState("Média");

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
        const typedData = data as unknown as CampaignSession;
        const squad = Array.isArray(typedData.squad) ? typedData.squad : [];
        const inventory = Array.isArray(typedData.inventory) ? typedData.inventory : [];
        const normalizedSession = { ...typedData, squad, inventory };
        
        setSession(normalizedSession);
        if (squad.length < 5) {
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
      const typedData = data as unknown as CampaignSession;
      setSession({
        ...typedData,
        squad: [],
        inventory: Array.isArray(typedData.inventory) ? typedData.inventory : []
      });
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
      cards.push({ ...char, selectedVersion: version, currentHp: 100 });
    }
    setCurrentCards(cards);
  };

  const useReroll = async () => {
    if (!session || session.reroll_used) return;
    const { data, error } = await supabase
      .from("campaign_sessions")
      .update({ reroll_used: true })
      .eq("id", session.id)
      .select()
      .single();

    if (data) {
      setSession(data as unknown as CampaignSession);
      generateCards();
      toast.info("Reroll utilizado!");
    }
  };

  const selectCharacter = async (char: any) => {
    if (!session) return;
    const newSquad = [...session.squad, char];
    const { data, error } = await supabase
      .from("campaign_sessions")
      .update({ squad: newSquad as any })
      .eq("id", session.id)
      .select()
      .single();

    if (data) {
      const typedData = data as unknown as CampaignSession;
      const normalized = {
        ...typedData,
        squad: Array.isArray(typedData.squad) ? typedData.squad : [],
        inventory: Array.isArray(typedData.inventory) ? typedData.inventory : []
      };
      setSession(normalized);
      if (normalized.squad.length < 5) {
        generateCards();
      } else {
        setView("battle");
      }
    }
  };

  const runBattle = async () => {
    if (!session) return;
    setIsSimulating(true);
    setBattleLogs(["O combate se inicia..."]);
    
    const currentBoss = BOSSES[session.current_boss_index];
    const squadOver = session.squad.reduce((acc, char) => acc + (char.selectedVersion?.over || 0), 0) / session.squad.length;
    
    const delay = battleSpeed === "lenta" ? 2000 : battleSpeed === "normal" ? 1000 : battleSpeed === "rapida" ? 500 : 0;

    const logs = [
      `Seu squad (Over Médio: ${squadOver.toFixed(1)}) encara ${currentBoss.name} (Over: ${currentBoss.over}).`,
      `Estratégia: ${selectedFormacao} com Intensidade ${selectedIntensidade}.`,
      "A luta se intensifica... Golpes são trocados em alta velocidade.",
      "As habilidades colidem, criando explosões no campo de batalha."
    ];

    if (battleSpeed !== "instant") {
      for (const log of logs) {
        setBattleLogs(prev => [...prev, log]);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    const winChance = (squadOver / currentBoss.over) * 0.5;
    const isWin = Math.random() < winChance + 0.3;

    const updatedSquad = session.squad.map(char => {
      const damage = isWin ? Math.random() * 15 : Math.random() * 40;
      const currentHp = char.currentHp !== undefined ? char.currentHp : 100;
      return { ...char, currentHp: Math.max(0, currentHp - damage) };
    });

    const finalLogs = isWin 
      ? [`${currentBoss.name} cai de joelhos! Vitória!`, "Seu squad respira aliviado enquanto coleta os espólios."]
      : [`O poder de ${currentBoss.name} é esmagador... Seu squad foi derrotado.`];

    if (battleSpeed !== "instant") {
      for (const log of finalLogs) {
        setBattleLogs(prev => [...prev, log]);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } else {
      setBattleLogs([...logs, ...finalLogs]);
    }

    setIsSimulating(false);

    if (isWin) {
      const { data } = await supabase.from("campaign_sessions").update({ squad: updatedSquad as any }).eq("id", session.id).select().single();
      if (data) setSession(data as unknown as CampaignSession);
      generateRewards();
      setView("reward");
    } else {
      setView("gameover");
    }
  };

  const generateRewards = () => {
    const rewards = [...CAMPAIGN_REWARDS].sort(() => 0.5 - Math.random()).slice(0, 3);
    setRewardChoices(rewards);
  };

  const selectReward = async (reward: any) => {
    if (!session) return;
    const newInventory = [...session.inventory, reward];
    const nextBossIndex = session.current_boss_index + 1;
    
    if (nextBossIndex >= BOSSES.length) {
      await supabase.from("campaign_sessions").update({ status: "won", current_boss_index: nextBossIndex }).eq("id", session.id);
      setView("gameover");
      toast.success("VOCÊ DERROTOU CAIM! A CAMPANHA FOI CONCLUÍDA!");
      return;
    }

    const { data } = await supabase
      .from("campaign_sessions")
      .update({ 
        inventory: newInventory as any,
        current_boss_index: nextBossIndex
      })
      .eq("id", session.id)
      .select()
      .single();

    if (data) {
      setSession(data as unknown as CampaignSession);
      setView("battle");
      setBattleLogs([]);
    }
  };

  const resetCampaign = async () => {
    if (session) {
      await supabase.from("campaign_sessions").update({ status: "lost" }).eq("id", session.id);
    }
    setSession(null);
    setView("start");
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
            Monte seu squad de 5 combatentes através de recrutamento por cartas e derrote todos os 18 chefes até chegar ao lendário Caim.
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

  if (view === "recruitment" && session) {
    return (
      <div className="flex flex-col gap-6 py-4">
        <div className="flex justify-between items-center px-4">
          <h2 className="retro-title text-xl">Recrutamento ({session.squad.length}/5)</h2>
          {session.difficulty === "normal" && !session.reroll_used && (
            <button onClick={useReroll} className="retro-button px-3 py-1 text-xs">Usar Reroll</button>
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

  if (view === "battle" && session) {
    const currentBoss = BOSSES[session.current_boss_index];
    if (!currentBoss) return null;

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
                {(["lenta", "normal", "rapida", "instant"] as const).map(s => (
                  <button 
                    key={s}
                    onClick={() => setBattleSpeed(s)}
                    className={`text-[9px] capitalize ${battleSpeed === s ? "text-accent font-bold underline" : "hover:text-accent underline"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <ScrollArea className="flex-1 p-4 h-[300px]">
              <div className="space-y-3 font-serif text-sm leading-relaxed text-muted-foreground italic">
                {battleLogs.length === 0 ? (
                  <p>O campo de batalha está silencioso. Seu squad se posiciona frente a {currentBoss.name}...</p>
                ) : (
                  battleLogs.map((log, i) => <p key={i}>{log}</p>)
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border">
              <Button 
                disabled={isSimulating}
                onClick={runBattle}
                className="w-full retro-button bg-accent text-accent-foreground font-bold italic py-6"
              >
                {isSimulating ? "BATALHANDO..." : "INICIAR BATALHA"}
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
                      <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${char.currentHp || 0}%` }}></div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-accent">{char.selectedVersion?.over || "???"}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="retro-panel p-4">
            <h4 className="text-[10px] font-bold uppercase mb-3 text-accent border-b border-accent/30 pb-1">Estratégia</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-muted-foreground uppercase">Estilo</label>
                <select 
                  value={selectedFormacao}
                  onChange={(e) => setSelectedFormacao(e.target.value)}
                  className="bg-black border border-border text-[10px] p-1"
                >
                  <option>Inteligente</option>
                  <option>Agressivo</option>
                  <option>Defensivo</option>
                  <option>Pressão</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-muted-foreground uppercase">Intensidade</label>
                <select 
                  value={selectedIntensidade}
                  onChange={(e) => setSelectedIntensidade(e.target.value)}
                  className="bg-black border border-border text-[10px] p-1"
                >
                  <option>Média</option>
                  <option>Baixa</option>
                  <option>Alta</option>
                  <option>Super Alta</option>
                </select>
              </div>
            </div>
          </div>

          <div className="retro-panel p-4">
            <h4 className="text-[10px] font-bold uppercase mb-3 text-accent border-b border-accent/30 pb-1">Inventário</h4>
            <div className="grid grid-cols-5 gap-1">
              {session.inventory.length === 0 ? (
                <div className="col-span-5 text-[9px] text-muted-foreground text-center py-2">Vazio</div>
              ) : (
                session.inventory.map((item, i) => (
                  <div key={i} className="aspect-square bg-black/40 border border-border flex items-center justify-center text-sm cursor-help hover:border-accent" title={item.name}>
                    {item.type === "buff_perm" ? "💎" : "🧪"}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "reward") {
    return (
      <div className="flex flex-col gap-8 py-10 max-w-4xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-black text-accent uppercase italic mb-2">Vitória Esmagadora!</h2>
          <p className="text-muted-foreground text-sm uppercase tracking-widest">Escolha apenas uma recompensa para seu squad</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewardChoices.map((reward, idx) => (
            <div 
              key={idx} 
              onClick={() => selectReward(reward)}
              className="retro-panel p-6 flex flex-col items-center text-center gap-4 group hover:border-accent cursor-pointer transition-all bg-black/60"
            >
              <div className="w-16 h-16 bg-muted flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {reward.type === "buff_perm" ? "💎" : "🧪"}
              </div>
              <div>
                <h4 className="font-bold text-accent text-sm mb-1">{reward.name}</h4>
                <p className="text-[10px] text-muted-foreground">{reward.description}</p>
              </div>
              <Button className="mt-auto retro-button w-full text-[10px]">COLETAR</Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "gameover") {
    const isWin = session?.current_boss_index === BOSSES.length;
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <h2 className={`text-6xl font-black uppercase italic ${isWin ? "text-accent" : "text-destructive"}`}>
          {isWin ? "CAMPANHA CONCLUÍDA" : "FIM DE JOGO"}
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          {isWin 
            ? "Você superou todos os desafios e derrotou Caim. Sua lenda será lembrada."
            : "Seu squad foi derrotado antes de alcançar o objetivo final. Tente novamente com uma nova estratégia."}
        </p>
        <Button onClick={resetCampaign} className="retro-button px-10 py-6 text-lg">
          VOLTAR AO INÍCIO
        </Button>
      </div>
    );
  }

  return null;
};

export default CampaignMode;
