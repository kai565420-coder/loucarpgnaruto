import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Item { id: string; nome: string; valor: string; peso: number }
interface Sheet { id: string; nome: string; dinheiro: number; bolsa_traseira_tamanho: string }

const TRASEIRA: Record<string, number> = { pequena: 10, media: 20, grande: 30 };
const LATERAL_MAX = 4;
const PAPEL = 0.5;

export const parseValor = (v: string) => {
  const m = (v || "").replace(/\s/g, "").match(/[\d.,]+/);
  if (!m) return 0;
  let s = m[0];
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
};

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const isLateral = (nome: string) => {
  const n = norm(nome);
  return !n.includes("fuma") && (n.includes("kunai") || n.includes("shuriken"));
};

const fmt = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 3 });

const LojaItens = ({ open, onOpenChange, items }: { open: boolean; onOpenChange: (o: boolean) => void; items: Item[] }) => {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [sheetId, setSheetId] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [used, setUsed] = useState({ lateral: 0, traseira: 0 });
  const [owned, setOwned] = useState<Record<string, number>>({});
  const [ownedList, setOwnedList] = useState<{ nome: string; qtd: number; bag: string; selado: boolean }[]>([]);
  const [busca, setBusca] = useState("");
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!open) return;
    supabase.from("character_sheets").select("id,nome,dinheiro,bolsa_traseira_tamanho").eq("arquivada", false).order("nome")
      .then(({ data }) => setSheets((data as Sheet[]) || []));
  }, [open]);

  const loadUsed = async (id: string) => {
    if (!id) { setOwned({}); setOwnedList([]); return setUsed({ lateral: 0, traseira: 0 }); }
    const { data } = await supabase.from("character_bag_items").select("bag_type,quantidade,is_papel_lacrado,item_id").eq("character_id", id);
    const ids = [...new Set((data || []).map((b) => b.item_id))];
    const pesos: Record<string, number> = {};
    const nomes: Record<string, string> = {};
    if (ids.length) {
      const [{ data: a }, { data: p }] = await Promise.all([
        supabase.from("items").select("id,peso,nome").in("id", ids),
        supabase.from("personalizados").select("id,peso,nome").in("id", ids),
      ]);
      [...(a || []), ...(p || [])].forEach((x: any) => { pesos[x.id] = Number(x.peso) || 0; nomes[x.id] = x.nome; });
    }
    const o: Record<string, number> = {};
    (data || []).forEach((b) => (o[b.item_id] = (o[b.item_id] || 0) + b.quantidade));
    setOwned(o);
    setOwnedList(
      (data || [])
        .map((b) => ({ nome: nomes[b.item_id] || "?", qtd: b.quantidade, bag: b.bag_type, selado: b.is_papel_lacrado }))
        .sort((x, y) => x.nome.localeCompare(y.nome))
    );
    const u = { lateral: 0, traseira: 0 };
    (data || []).forEach((b) => {
      if (b.bag_type !== "lateral" && b.bag_type !== "traseira") return;
      u[b.bag_type as "lateral" | "traseira"] += (b.is_papel_lacrado ? PAPEL : pesos[b.item_id] || 0) * b.quantidade;
    });
    setUsed(u);
  };

  useEffect(() => { loadUsed(sheetId); }, [sheetId]);

  const sheet = sheets.find((s) => s.id === sheetId);
  const perg = items.find((i) => norm(i.nome).startsWith("pergaminho"));
  const precoPerg = perg ? parseValor(perg.valor) : 0;
  const lines = Object.entries(cart).filter(([, q]) => q > 0).map(([key, q]) => {
    const [id, flag] = key.split("|");
    const selado = flag === "s";
    const it = items.find((i) => i.id === id)!;
    return it && { key, it, q, selado, preco: parseValor(it.valor) + (selado ? precoPerg : 0), peso: selado ? PAPEL : Number(it.peso) || 0, bag: isLateral(it.nome) ? "lateral" : "traseira" };
  }).filter(Boolean) as { key: string; it: Item; q: number; selado: boolean; preco: number; peso: number; bag: "lateral" | "traseira" }[];

  const total = lines.reduce((s, l) => s + l.preco * l.q, 0);
  const add = { lateral: 0, traseira: 0 };
  lines.forEach((l) => (add[l.bag] += l.peso * l.q));
  const trasMax = TRASEIRA[sheet?.bolsa_traseira_tamanho || ""] || 10;
  const latOver = used.lateral + add.lateral > LATERAL_MAX + 1e-9;
  const trasOver = used.traseira + add.traseira > trasMax + 1e-9;
  const saldo = Number(sheet?.dinheiro || 0);
  const semSaldo = total > saldo;
  const canBuy = !!sheet && lines.length > 0 && !latOver && !trasOver && !semSaldo && !buying;

  const filtrados = useMemo(() => items.filter((i) => i.nome.toLowerCase().includes(busca.toLowerCase())).sort((a, b) => a.nome.localeCompare(b.nome)), [items, busca]);

  const setQ = (key: string, q: number) => setCart((c) => ({ ...c, [key]: Math.max(0, q) }));
  const toggleSelado = (key: string, q: number) => {
    const [id, flag] = key.split("|");
    const nk = flag === "s" ? id : `${id}|s`;
    setCart((c) => ({ ...c, [key]: 0, [nk]: (c[nk] || 0) + q }));
  };

  const comprar = async () => {
    if (!sheet || !canBuy) return;
    setBuying(true);
    try {
      const { data: fresh } = await supabase.from("character_sheets").select("dinheiro").eq("id", sheet.id).single();
      const atual = Number(fresh?.dinheiro ?? 0);
      if (atual < total) { toast.error("Saldo insuficiente!"); return; }
      const { data: existing } = await supabase.from("character_bag_items").select("id,item_id,bag_type,quantidade,is_papel_lacrado")
        .eq("character_id", sheet.id);
      for (const l of lines) {
        const ex = (existing || []).find((e) => e.item_id === l.it.id && e.bag_type === l.bag && e.is_papel_lacrado === l.selado);
        const { error } = ex
          ? await supabase.from("character_bag_items").update({ quantidade: ex.quantidade + l.q }).eq("id", ex.id)
          : await supabase.from("character_bag_items").insert({
              character_id: sheet.id, item_id: l.it.id, bag_type: l.bag, quantidade: l.q, is_papel_lacrado: l.selado,
              durabilidade: l.it.nome.toLowerCase().includes("cota de malha") ? 200 : null,
            });
        if (error) throw error;
      }
      const { error } = await supabase.from("character_sheets").update({ dinheiro: atual - total }).eq("id", sheet.id);
      if (error) throw error;
      toast.success(`Compra feita! ${fmt(total)} 両 descontados de ${sheet.nome}.`);
      setCart({});
      setSheets((s) => s.map((x) => (x.id === sheet.id ? { ...x, dinheiro: atual - total } : x)));
      loadUsed(sheet.id);
    } catch {
      toast.error("Erro ao finalizar a compra (sem permissão para essa ficha?)");
    } finally {
      setBuying(false);
    }
  };

  const bar = (label: string, u: number, a: number, max: number, over: boolean) => (
    <div className="text-[11px]">
      <div className="flex justify-between"><span>{label}</span>
        <span className={over ? "text-destructive font-bold" : "text-foreground"}>{fmt(u)} + {fmt(a)} / {max}</span></div>
      <div className="h-2 border border-border bg-muted">
        <div className={over ? "h-full bg-destructive" : "h-full bg-accent"} style={{ width: `${Math.min(100, ((u + a) / max) * 100)}%` }} />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto font-mono">
        <DialogHeader><DialogTitle className="text-accent">🛒 Loja de Itens</DialogTitle></DialogHeader>

        <div className="space-y-1">
          <label className="text-xs font-bold text-accent">Personagem que vai receber</label>
          <select className="retro-input w-full text-xs" value={sheetId} onChange={(e) => setSheetId(e.target.value)}>
            <option value="">— Escolha o personagem —</option>
            {sheets.map((s) => <option key={s.id} value={s.id}>{s.nome} — {fmt(Number(s.dinheiro))} 両</option>)}
          </select>
          {sheet && <div className="text-xs">Saldo: <b className="text-accent">{fmt(saldo)} 両</b></div>}
        </div>

        {sheet && (
          <div className="retro-panel p-2">
            <div className="text-xs font-bold text-accent mb-1">🎒 Inventário atual de {sheet.nome}</div>
            {ownedList.length === 0 ? (
              <div className="text-[11px] text-muted-foreground">Inventário vazio.</div>
            ) : (
              <div className="max-h-28 overflow-y-auto grid sm:grid-cols-2 gap-x-3 text-[11px]">
                {ownedList.map((o, idx) => (
                  <div key={idx} className="flex justify-between border-b border-border/50 py-0.5">
                    <span className="truncate">{o.selado ? "📜 " : ""}{o.nome}</span>
                    <span className="text-muted-foreground ml-2 shrink-0">x{o.qtd} · {o.bag === "lateral" ? "📌" : o.bag === "traseira" ? "🎒" : "⚔️"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-3">
          <div className="retro-panel p-2">
            <input className="retro-input w-full text-xs mb-2" placeholder="🔍 Buscar item..." value={busca} onChange={(e) => setBusca(e.target.value)} />
            <div className="max-h-72 overflow-y-auto space-y-1">
              {filtrados.map((i) => (
                <div key={i.id} className="flex items-center justify-between gap-2 border border-border p-1 text-xs">
                  <div className="min-w-0">
                    <div className="truncate font-bold">{i.nome}</div>
                    <div className="text-muted-foreground">{fmt(parseValor(i.valor))} 両 · peso {fmt(Number(i.peso))} · {isLateral(i.nome) ? "lateral" : "traseira"}</div>
                    {sheet && <div className={owned[i.id] ? "text-accent" : "text-muted-foreground"}>🎒 No inventário: {owned[i.id] || 0}</div>}
                  </div>
                  <button className="retro-button px-2 py-0.5" onClick={() => setQ(i.id, (cart[i.id] || 0) + 1)}>+</button>
                </div>
              ))}
            </div>
          </div>

          <div className="retro-panel p-2 space-y-2">
            <div className="text-xs font-bold text-accent">🧺 Carrinho</div>
            <div className="text-[10px] text-muted-foreground">Clique em ▫️ para o item já vir no papel lacrado (preço do item + pergaminho {fmt(precoPerg)} 両, peso {PAPEL}).</div>
            {lines.length === 0 && <div className="text-xs text-muted-foreground">Nenhum item adicionado.</div>}
            {lines.map((l) => (
              <div key={l.key} className="flex items-center gap-1 text-xs border border-border p-1">
                <button className="retro-button px-1.5" title={l.selado ? "Comprar sem papel lacrado" : `Já vir no papel lacrado (+${fmt(precoPerg)} 両 por unidade)`} onClick={() => toggleSelado(l.key, l.q)}>{l.selado ? "📜" : "▫️"}</button>
                <span className="flex-1 truncate">{l.selado ? `📜 ${l.it.nome}: Papel Selado` : l.it.nome} <span className="text-muted-foreground">({l.bag === "lateral" ? "📌" : "🎒"})</span></span>
                <button className="retro-button px-1.5" onClick={() => setQ(l.key, l.q - 1)}>−</button>
                <input type="number" min={0} className="retro-input w-12 text-xs text-center" value={l.q} onChange={(e) => setQ(l.key, parseInt(e.target.value) || 0)} />
                <button className="retro-button px-1.5" onClick={() => setQ(l.key, l.q + 1)}>+</button>
                <span className="w-20 text-right">{fmt(l.preco * l.q)} 両</span>
                <button className="retro-button px-1.5" onClick={() => setQ(l.key, 0)}>✕</button>
              </div>
            ))}
            <div className="border-t border-border pt-2 text-xs space-y-1">
              <div>Itens: <b>{lines.reduce((s, l) => s + l.q, 0)}</b></div>
              <div>Total: <b className={semSaldo ? "text-destructive" : "text-accent"}>{fmt(total)} 両</b></div>
              {sheet && <div>Saldo após compra: <b className={semSaldo ? "text-destructive" : ""}>{fmt(saldo - total)} 両</b></div>}
            </div>
            {sheet && (
              <div className="space-y-2">
                {bar("📌 Bolsa Lateral", used.lateral, add.lateral, LATERAL_MAX, latOver)}
                {bar(`🎒 Bolsa Traseira (${sheet.bolsa_traseira_tamanho})`, used.traseira, add.traseira, trasMax, trasOver)}
              </div>
            )}
            {(latOver || trasOver) && <div className="text-destructive text-xs font-bold">⚠️ Sem espaço na mochila — remova itens do carrinho.</div>}
            {semSaldo && sheet && <div className="text-destructive text-xs font-bold">⚠️ Saldo insuficiente.</div>}
            <button className="retro-button w-full py-2 disabled:opacity-50" disabled={!canBuy} onClick={comprar}>
              {buying ? "Comprando..." : "💰 Finalizar Compra"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LojaItens;
