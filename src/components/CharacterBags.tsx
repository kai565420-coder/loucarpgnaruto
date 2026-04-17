import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BagItem {
  id: string;
  item_id: string;
  bag_type: string;
  quantidade: number;
  is_papel_lacrado: boolean;
  item: {
    nome: string;
    peso: number;
    imagem_url: string | null;
    descricao?: string;
    valor?: string;
  };
}

interface Item {
  id: string;
  nome: string;
  peso: number;
  imagem_url: string | null;
}

interface PersonalizadoItem {
  id: string;
  nome: string;
  peso: number;
  imagem_url: string | null;
}

interface CharacterBagsProps {
  characterId: string;
  bolsaTraseiraTamanho: string;
  editing: boolean;
  canEdit: boolean;
  dinheiro: number;
  onTamanhoChange?: (tamanho: string) => void;
  onDinheiroChange?: (value: number) => void;
  onOpenItem?: (item: { id: string; nome: string; descricao: string; valor: string; peso?: number; imagem_url: string | null }) => void;
}

const TRASEIRA_SIZES: Record<string, number> = {
  pequena: 10,
  media: 20,
  grande: 30,
};

const PAPEL_LACRADO_PESO = 0.5;

const CharacterBags = ({ characterId, bolsaTraseiraTamanho, editing, canEdit, dinheiro, onTamanhoChange, onDinheiroChange, onOpenItem }: CharacterBagsProps) => {
  const [bagItems, setBagItems] = useState<BagItem[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [personalizados, setPersonalizados] = useState<PersonalizadoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [addQtd, setAddQtd] = useState(1);
  const [addAsPapelLacrado, setAddAsPapelLacrado] = useState(false);
  const [itemSource, setItemSource] = useState<"items" | "personalizados">("items");

  const fetchBagItems = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("character_bag_items")
      .select("id, item_id, bag_type, quantidade, is_papel_lacrado")
      .eq("character_id", characterId);

    if (data && data.length > 0) {
      const itemIds = data.map((d) => d.item_id);
      
      // Fetch from both items and personalizados
      const [{ data: itemsData }, { data: persData }] = await Promise.all([
        supabase.from("items").select("id, nome, peso, imagem_url, descricao, valor").in("id", itemIds),
        supabase.from("personalizados").select("id, nome, peso, imagem_url, descricao, valor").in("id", itemIds),
      ]);

      const itemsMap = new Map([
        ...((itemsData || []).map((i) => [i.id, i] as [string, any])),
        ...((persData || []).map((i) => [i.id, i] as [string, any])),
      ]);
      
      const enriched = data.map((d) => ({
        ...d,
        item: itemsMap.get(d.item_id) || { nome: "?", peso: 0, imagem_url: null },
      }));
      setBagItems(enriched);
    } else {
      setBagItems([]);
    }
    setLoading(false);
  }, [characterId]);

  const fetchAllItems = useCallback(async () => {
    const [{ data: items }, { data: pers }] = await Promise.all([
      supabase.from("items").select("id, nome, peso, imagem_url").order("nome"),
      supabase.from("personalizados").select("id, nome, peso, imagem_url").order("nome"),
    ]);
    setAllItems(items || []);
    setPersonalizados(pers || []);
  }, []);

  useEffect(() => {
    fetchBagItems();
    fetchAllItems();
  }, [fetchBagItems, fetchAllItems]);

  const lateralItems = bagItems.filter((b) => b.bag_type === "lateral");
  const traseiraItems = bagItems.filter((b) => b.bag_type === "traseira");
  const equipadoItems = bagItems.filter((b) => b.bag_type === "equipado");

  const lateralMax = 4;
  const lateralUsed = lateralItems.reduce((s, b) => {
    const itemPeso = b.is_papel_lacrado ? PAPEL_LACRADO_PESO : b.item.peso;
    return s + itemPeso * b.quantidade;
  }, 0);

  const traseiraMax = TRASEIRA_SIZES[bolsaTraseiraTamanho] || 10;
  const traseiraUsed = traseiraItems.reduce((s, b) => {
    const itemPeso = b.is_papel_lacrado ? PAPEL_LACRADO_PESO : b.item.peso;
    return s + itemPeso * b.quantidade;
  }, 0);

  const getItemWeight = (bi: BagItem) => {
    return bi.is_papel_lacrado ? PAPEL_LACRADO_PESO : bi.item.peso;
  };

  const isLateralEligible = (nome: string) => {
    const n = nome.toLowerCase();
    if (n.includes("fuma")) return false;
    return n.includes("kunai") || n.includes("shuriken");
  };

  const getAvailableItems = (bagType: string) => {
    if (bagType === "equipado") return personalizados;
    if (bagType === "lateral") {
      return allItems.filter((i) => isLateralEligible(i.nome));
    }
    // traseira - show both based on itemSource
    if (itemSource === "personalizados") return personalizados;
    return allItems;
  };

  const handleAdd = async (bagType: string) => {
    if (!selectedItemId) return;
    if (addQtd < 1) return;

    const allAvailable = [...allItems, ...personalizados];
    const item = allAvailable.find((i) => i.id === selectedItemId);
    if (!item) return;

    if (bagType === "lateral") {
      if (!isLateralEligible(item.nome)) {
        toast.error("A bolsa lateral aceita apenas Kunais e Shurikens (exceto Fuma Shuriken)!");
        return;
      }
      const itemPeso = addAsPapelLacrado ? PAPEL_LACRADO_PESO : item.peso;
      const spaceNeeded = itemPeso * addQtd;
      if (lateralUsed + spaceNeeded > lateralMax) {
        toast.error(`Espaço insuficiente na bolsa lateral! (${(lateralMax - lateralUsed).toFixed(2)} restantes)`);
        return;
      }
    }

    if (bagType === "traseira") {
      const itemPeso = addAsPapelLacrado ? PAPEL_LACRADO_PESO : item.peso;
      const spaceNeeded = itemPeso * addQtd;
      if (traseiraUsed + spaceNeeded > traseiraMax) {
        toast.error(`Espaço insuficiente na bolsa traseira! (${(traseiraMax - traseiraUsed).toFixed(1)} restantes)`);
        return;
      }
    }

    // equipado items have weight 0, no space check needed

    const existing = bagItems.find((b) => b.item_id === selectedItemId && b.bag_type === bagType && b.is_papel_lacrado === addAsPapelLacrado);
    if (existing) {
      const { error } = await supabase
        .from("character_bag_items")
        .update({ quantidade: existing.quantidade + addQtd })
        .eq("id", existing.id);
      if (error) { toast.error("Erro ao atualizar"); return; }
    } else {
      const { error } = await supabase.from("character_bag_items").insert({
        character_id: characterId,
        item_id: selectedItemId,
        bag_type: bagType,
        quantidade: addQtd,
        is_papel_lacrado: bagType === "equipado" ? false : addAsPapelLacrado,
      });
      if (error) { toast.error("Erro ao adicionar"); return; }
    }

    toast.success("Item adicionado!");
    setSelectedItemId("");
    setAddQtd(1);
    setAddAsPapelLacrado(false);
    setAddingTo(null);
    setItemSource("items");
    fetchBagItems();
  };

  const handleRemove = async (bagItemId: string) => {
    const { error } = await supabase.from("character_bag_items").delete().eq("id", bagItemId);
    if (error) { toast.error("Erro ao remover"); return; }
    toast.success("Item removido!");
    fetchBagItems();
  };

  const handleChangeQtd = async (bagItemId: string, newQtd: number) => {
    if (newQtd < 1) return;
    const { error } = await supabase.from("character_bag_items").update({ quantidade: newQtd }).eq("id", bagItemId);
    if (error) { toast.error("Erro ao atualizar"); return; }
    fetchBagItems();
  };

  const handleMoveTo = async (bagItemId: string, newBagType: string) => {
    const { error } = await supabase.from("character_bag_items").update({ bag_type: newBagType }).eq("id", bagItemId);
    if (error) { toast.error("Erro ao mover"); return; }
    toast.success("Item movido!");
    fetchBagItems();
  };

  const renderBagTable = (items: BagItem[], bagType: string, used: number | null, max: number | null, label: string) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-accent font-bold text-[11px]">{label}</span>
        {used !== null && max !== null && (
          <span className={`text-[10px] font-bold ${used > max ? "text-destructive" : "text-muted-foreground"}`}>
            {Number(used.toFixed(2))}/{max} peso
          </span>
        )}
      </div>
      {used !== null && max !== null && (
        <div className="w-full h-2 border border-border mb-2" style={{ background: "hsl(0 0% 5%)" }}>
          <div
            className="h-full transition-all"
            style={{
              width: `${Math.min((used / max) * 100, 100)}%`,
              background: used > max ? "hsl(0 70% 45%)" : "hsl(140 60% 40%)",
            }}
          />
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-[10px] text-muted-foreground text-center py-2">Vazia</div>
      ) : (
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left retro-label py-1">Nome</th>
              {bagType !== "equipado" && <th className="text-center retro-label py-1 w-12">Peso</th>}
              <th className="text-center retro-label py-1 w-12">Qtd.</th>
              {editing && canEdit && <th className="w-16"></th>}
            </tr>
          </thead>
          <tbody>
            {items.map((bi) => (
              <tr key={bi.id} className="border-b border-border last:border-0">
                <td className="py-1 text-foreground">
                  {(() => {
                    const canOpen = !!onOpenItem && (!!bi.item.descricao || !!bi.item.valor || !!bi.item.imagem_url);
                    const content = bi.is_papel_lacrado ? (
                      <span title="Papel Lacrado">📜 {bi.item.nome}: Papel Selado</span>
                    ) : (
                      <span>{bi.item.nome}</span>
                    );
                    if (canOpen) {
                      return (
                        <button
                          onClick={() => onOpenItem?.({
                            id: bi.item_id,
                            nome: bi.item.nome,
                            descricao: bi.item.descricao || "",
                            valor: bi.item.valor || "",
                            peso: bi.item.peso,
                            imagem_url: bi.item.imagem_url,
                          })}
                          className="text-left hover:text-accent transition-colors underline-offset-2 hover:underline"
                        >
                          {content}
                        </button>
                      );
                    }
                    return content;
                  })()}
                </td>
                {bagType !== "equipado" && (
                  <td className="py-1 text-center text-muted-foreground">{getItemWeight(bi)}</td>
                )}
                <td className="py-1 text-center">
                  {editing && canEdit ? (
                    <input
                      type="number"
                      className="retro-input w-10 text-center text-[10px]"
                      value={bi.quantidade}
                      min={1}
                      onChange={(e) => handleChangeQtd(bi.id, parseInt(e.target.value) || 1)}
                    />
                  ) : (
                    <span className="text-foreground">{bi.quantidade}</span>
                  )}
                </td>
                {editing && canEdit && (
                  <td className="py-1 text-center flex gap-1 items-center justify-center">
                    {/* Move buttons for equipado <-> traseira */}
                    {bagType === "equipado" && (
                      <button onClick={() => handleMoveTo(bi.id, "traseira")} className="text-[9px] text-accent hover:underline" title="Mover para bolsa">🎒</button>
                    )}
                    {bagType === "traseira" && personalizados.some(p => p.id === bi.item_id) && (
                      <button onClick={() => handleMoveTo(bi.id, "equipado")} className="text-[9px] text-accent hover:underline" title="Equipar">⚔️</button>
                    )}
                    <button onClick={() => handleRemove(bi.id)} className="text-destructive hover:text-destructive/80 text-[10px]">✕</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && canEdit && (
        <div className="mt-1">
          {addingTo === bagType ? (
            <div className="flex flex-col gap-1 mt-1">
              {bagType === "traseira" && (
                <div className="flex gap-1 mb-1">
                  <button
                    onClick={() => { setItemSource("items"); setSelectedItemId(""); }}
                    className={`text-[9px] px-2 py-0.5 border ${itemSource === "items" ? "border-accent text-accent" : "border-border text-muted-foreground"}`}
                  >Itens</button>
                  <button
                    onClick={() => { setItemSource("personalizados"); setSelectedItemId(""); }}
                    className={`text-[9px] px-2 py-0.5 border ${itemSource === "personalizados" ? "border-accent text-accent" : "border-border text-muted-foreground"}`}
                  >Personalizados</button>
                </div>
              )}
              <select
                className="retro-input text-[10px] w-full"
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
              >
                <option value="">Selecione um item...</option>
                {getAvailableItems(bagType).map((i) => (
                  <option key={i.id} value={i.id}>{i.nome} (peso: {i.peso})</option>
                ))}
              </select>
              {bagType === "traseira" && (
                <label className="flex items-center gap-1 text-[10px] text-foreground">
                  <input
                    type="checkbox"
                    checked={addAsPapelLacrado}
                    onChange={(e) => setAddAsPapelLacrado(e.target.checked)}
                    className="accent-[hsl(25,100%,50%)]"
                  />
                  📜 Papel Lacrado (peso: {PAPEL_LACRADO_PESO})
                </label>
              )}
              <div className="flex gap-1">
                <input
                  type="number"
                  className="retro-input w-14 text-center text-[10px]"
                  value={addQtd}
                  min={1}
                  onChange={(e) => setAddQtd(parseInt(e.target.value) || 1)}
                  placeholder="Qtd"
                />
                <button onClick={() => handleAdd(bagType)} className="retro-button text-[10px] flex-1">✅ Add</button>
                <button onClick={() => { setAddingTo(null); setAddAsPapelLacrado(false); setItemSource("items"); }} className="retro-button text-[10px]">✕</button>
              </div>
            </div>
          ) : (
            <button onClick={() => { setAddingTo(bagType); setSelectedItemId(""); setAddQtd(1); setAddAsPapelLacrado(false); setItemSource("items"); }} className="text-[10px] text-accent hover:underline mt-1">
              ➕ Adicionar item
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (loading) return <div className="text-[10px] text-muted-foreground">Carregando bolsas...</div>;

  return (
    <div>
      <div className="retro-section-title text-xs">🎒 Bolsa</div>

      {editing && canEdit && (
        <div className="mb-2 flex items-center gap-2">
          <span className="retro-label text-[10px]">Tamanho Traseira:</span>
          <select
            className="retro-input text-[10px]"
            value={bolsaTraseiraTamanho}
            onChange={(e) => onTamanhoChange?.(e.target.value)}
          >
            <option value="pequena">Pequena (10)</option>
            <option value="media">Média (20)</option>
            <option value="grande">Grande (30)</option>
          </select>
        </div>
      )}

      {renderBagTable(lateralItems, "lateral", lateralUsed, lateralMax, "📌 Bolsa Lateral (Kunais/Shurikens)")}
      {renderBagTable(traseiraItems, "traseira", traseiraUsed, traseiraMax, `🎒 Bolsa Traseira (${bolsaTraseiraTamanho.charAt(0).toUpperCase() + bolsaTraseiraTamanho.slice(1)})`)}
      {renderBagTable(equipadoItems, "equipado", null, null, "⚔️ Itens Equipados")}

      {/* Dinheiro */}
      <div className="mt-2 border-t border-border pt-2">
        <div className="flex items-center gap-2">
          <span className="text-accent font-bold text-[11px]">💰 Ryos: 両</span>
          {editing && canEdit ? (
            <input
              type="text"
              className="retro-input w-24 text-center text-[11px]"
              value={dinheiro}
              onChange={(e) => {
                const val = parseFloat(e.target.value.replace(/[^\d.]/g, "")) || 0;
                onDinheiroChange?.(val);
              }}
            />
          ) : (
            <span className="text-foreground font-bold text-sm">{dinheiro.toLocaleString("pt-BR")}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterBags;
