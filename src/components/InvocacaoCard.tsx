import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getJutsuEmoji } from "@/lib/jutsuEmoji";
import { INVOCACAO_ATRIBUTOS, INVOCACAO_PERICIAS } from "@/lib/invocacao";

const MAESTRIA_LEVELS = ["Nula", "I", "II", "III", "IV", "V"];

interface InvocacaoCardProps {
  linkId: string;
  jutsu: Record<string, any>;
  maestria: string;
  vida: number | null;
  sanidade: number | null;
  chakra: number | null;
  canEdit: boolean;
  editing: boolean;
  onMaestriaChange: (jutsuId: string, level: string) => void;
  onOpenJutsu: (jutsu: any) => void;
}

interface SubLink {
  id: string;
  jutsu_id: string;
  maestria_nivel: string;
  nome: string;
  jutsu: Record<string, any>;
}

const InvocacaoCard = ({
  linkId, jutsu, maestria, vida, sanidade, chakra, canEdit, editing, onMaestriaChange, onOpenJutsu,
}: InvocacaoCardProps) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState({
    inv_vida: vida ?? jutsu.inv_vida_max ?? 0,
    inv_sanidade: sanidade ?? jutsu.inv_sanidade_max ?? 0,
    inv_chakra: chakra ?? jutsu.inv_chakra_max ?? 0,
  });

  useEffect(() => {
    setStatus({
      inv_vida: vida ?? jutsu.inv_vida_max ?? 0,
      inv_sanidade: sanidade ?? jutsu.inv_sanidade_max ?? 0,
      inv_chakra: chakra ?? jutsu.inv_chakra_max ?? 0,
    });
  }, [vida, sanidade, chakra, jutsu]);
  const [subs, setSubs] = useState<SubLink[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [allJutsus, setAllJutsus] = useState<Record<string, any>[]>([]);

  const fetchSubs = useCallback(async () => {
    const { data } = await (supabase as any)
      .from("invocacao_jutsus")
      .select("id, jutsu_id, maestria_nivel")
      .eq("character_jutsu_id", linkId);
    const links = data || [];
    if (links.length === 0) { setSubs([]); return; }
    const { data: js } = await supabase.from("jutsus").select("*").in("id", links.map((l: any) => l.jutsu_id));
    setSubs(
      links
        .map((l: any) => {
          const j = (js || []).find((x: any) => x.id === l.jutsu_id);
          return j ? { id: l.id, jutsu_id: l.jutsu_id, maestria_nivel: l.maestria_nivel || "I", nome: j.nome, jutsu: j } : null;
        })
        .filter(Boolean)
        .sort((a: any, b: any) => a.nome.localeCompare(b.nome)) as SubLink[]
    );
  }, [linkId]);

  useEffect(() => { if (open) fetchSubs(); }, [open, fetchSubs]);

  useEffect(() => { if (!editing) setShowSelector(false); }, [editing]);

  useEffect(() => {
    if (showSelector && allJutsus.length === 0) {
      supabase.from("jutsus").select("*").neq("categoria", "invocacao").order("nome").then(({ data }) => setAllJutsus(data || []));
    }
  }, [showSelector, allJutsus.length]);

  const saveStatus = async (key: string, value: number) => {
    setStatus((prev) => ({ ...prev, [key]: value }));
    const { error } = await (supabase as any).from("character_jutsus").update({ [key]: value }).eq("id", linkId);
    if (error) toast.error("Erro ao salvar status da invocação");
  };

  const addSub = async (jutsuId: string) => {
    const { error } = await (supabase as any)
      .from("invocacao_jutsus")
      .insert({ character_jutsu_id: linkId, jutsu_id: jutsuId, maestria_nivel: "I" });
    if (error) { toast.error("Erro ao adicionar jutsu"); return; }
    fetchSubs();
  };

  const removeSub = async (id: string) => {
    await (supabase as any).from("invocacao_jutsus").delete().eq("id", id);
    fetchSubs();
  };

  const changeSubMaestria = async (id: string, level: string) => {
    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, maestria_nivel: level } : s)));
    await (supabase as any).from("invocacao_jutsus").update({ maestria_nivel: level }).eq("id", id);
  };

  const podeEditar = canEdit && editing;

  const bar = (label: string, key: string, maxKey: string, color: string) => {
    const max = jutsu[maxKey] ?? 0;
    const cur = (status as any)[key] ?? 0;
    const pct = max > 0 ? Math.min(100, Math.max(0, (cur / max) * 100)) : 0;
    return (
      <div className="mb-2">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="retro-label">{label}:</span>
          {podeEditar ? (
            <span className="flex items-center gap-1">
              <input
                type="number"
                className="retro-input w-12 text-center text-[10px]"
                value={cur}
                onChange={(e) => setStatus((prev) => ({ ...prev, [key]: parseInt(e.target.value) || 0 }))}
                onBlur={(e) => saveStatus(key, parseInt(e.target.value) || 0)}
              />
              <span className="text-muted-foreground">/ {max}</span>
            </span>
          ) : (
            <span className="retro-value font-bold">{cur}/{max}</span>
          )}
        </div>
        <div className="w-full h-3 border border-border" style={{ background: "hsl(0 0% 5%)" }}>
          <div className="h-full transition-all" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    );
  };

  return (
    <div className="border border-border mb-2">
      <div className="flex items-center justify-between px-2 py-1 bg-card">
        <button onClick={() => setOpen(!open)} className="text-left text-xs text-foreground hover:text-accent flex-1">
          {open ? "▼" : "▶"} 🦁 {jutsu.nome}
          <span className="text-[9px] text-muted-foreground ml-2">Custo: <span className="text-accent font-bold">{jutsu.custo_invocacao ?? 0}</span> chakra</span>
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onOpenJutsu(jutsu)} className="text-[10px] text-muted-foreground hover:text-accent" title="Ver informações">🔍</button>
          {editing && canEdit ? (
            <select className="retro-input text-[9px]" value={maestria} onChange={(e) => onMaestriaChange(jutsu.id, e.target.value)}>
              {MAESTRIA_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl === "Nula" ? "Sem Maestria" : `Maestria ${lvl}`}</option>
              ))}
            </select>
          ) : (
            <span className="text-[9px] text-muted-foreground border border-border px-1 py-0.5">
              {maestria === "Nula" ? "Sem Maestria" : `Maestria ${maestria}`}
            </span>
          )}
        </div>
      </div>

      {open && (
        <div className="p-2">
          {bar("💖 Vida", "inv_vida", "inv_vida_max", "hsl(0 70% 45%)")}
          {bar("🧠 Sanidade", "inv_sanidade", "inv_sanidade_max", "hsl(210 70% 45%)")}
          {bar("🌀 Chakra", "inv_chakra", "inv_chakra_max", "hsl(200 80% 50%)")}

          <div className="grid grid-cols-2 gap-2 mt-2 mb-2">
            {INVOCACAO_ATRIBUTOS.map(({ key, label }) => (
              <div key={key} className="bg-card border-2 border-accent/60 p-1 flex flex-col items-center">
                <span className="retro-label text-[9px] uppercase">{label}</span>
                <span className="text-accent font-bold text-lg leading-none">{jutsu[key] ?? 0}</span>
              </div>
            ))}
          </div>

          <div className="text-accent font-bold text-[11px] border-b border-border pb-1 mb-1">Perícias</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            {INVOCACAO_PERICIAS.map(({ key, label }) => (
              <div key={key} className="grid grid-cols-[minmax(0,1fr)_40px] items-center text-[11px] py-[1px]">
                <span className="retro-label leading-tight">{label}:</span>
                <span className="retro-value font-bold text-right">{jutsu[key] ?? 0}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-3 mb-1">
            <span className="text-accent font-bold text-[11px]">Jutsus da Invocação ({subs.length})</span>
            {podeEditar && (
              <button onClick={() => setShowSelector(!showSelector)} className="retro-button text-[10px] px-2 py-0.5">➕ Adicionar</button>
            )}
          </div>

          {showSelector && podeEditar && (
            <div className="retro-panel p-2 mb-2 max-h-[160px] overflow-y-auto">
              {allJutsus.filter((j) => !subs.some((s) => s.jutsu_id === j.id)).map((j) => (
                <button key={j.id} onClick={() => addSub(j.id)} className="block w-full text-left text-[11px] py-0.5 px-1 hover:bg-muted text-foreground">
                  {getJutsuEmoji(j.nome)} {j.nome}
                </button>
              ))}
            </div>
          )}

          {subs.length === 0 ? (
            <p className="text-muted-foreground text-[10px]">Nenhum jutsu aprendido.</p>
          ) : (
            subs.map((s) => (
              <div key={s.id} className="flex items-center justify-between border-b border-border last:border-0 px-1 py-1">
                <button onClick={() => onOpenJutsu(s.jutsu)} className="text-left text-[11px] text-foreground hover:text-accent flex-1">
                  {getJutsuEmoji(s.nome)} {s.nome}
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  {podeEditar ? (
                    <select className="retro-input text-[9px]" value={s.maestria_nivel} onChange={(e) => changeSubMaestria(s.id, e.target.value)}>
                      {MAESTRIA_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl === "Nula" ? "Sem Maestria" : `Maestria ${lvl}`}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-[9px] text-muted-foreground border border-border px-1 py-0.5">
                      {s.maestria_nivel === "Nula" ? "Sem Maestria" : `Maestria ${s.maestria_nivel}`}
                    </span>
                  )}
                  {podeEditar && (
                    <button onClick={() => removeSub(s.id)} className="text-[10px] text-muted-foreground hover:text-destructive" title="Remover">🗑️</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default InvocacaoCard;
