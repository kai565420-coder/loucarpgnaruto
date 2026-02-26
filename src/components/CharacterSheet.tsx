import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

interface CharacterSheetProps {
  sheet: Tables<"character_sheets">;
  isOwner: boolean;
  onDelete?: () => void;
  onUpdated?: () => void;
}

const atributos = [
  { key: "forca_fisica", label: "Força Física" },
  { key: "destreza", label: "Destreza" },
];

const barAtributos = [
  { key: "vida", maxKey: "vida_max", label: "Vida", color: "hsl(0 70% 45%)" },
  { key: "sanidade", maxKey: "sanidade_max", label: "Sanidade", color: "hsl(210 70% 45%)" },
  { key: "chakra", maxKey: "chakra_max", label: "Chakra", color: "hsl(200 80% 50%)" },
];

const maestrias = [
  { key: "maestria_fogo", label: "Fogo" },
  { key: "maestria_vento", label: "Vento" },
  { key: "maestria_terra", label: "Terra" },
  { key: "maestria_agua", label: "Água" },
  { key: "maestria_raio", label: "Raio" },
];

const pericias = [
  {
    grupo: "FOR",
    items: [
      { key: "taijutsu", label: "Taijutsu" },
      { key: "forca_bruta", label: "Força Bruta" },
      { key: "imobilizacao", label: "Imobilização" },
    ],
  },
  {
    grupo: "AGI",
    items: [
      { key: "acrobacia", label: "Acrobacia" },
      { key: "furtividade", label: "Furtividade" },
      { key: "shurikenjutsu", label: "Shurikenjutsu" },
      { key: "kenjutsu", label: "Kenjutsu" },
      { key: "reflexos_ninja", label: "Reflexos Ninja" },
      { key: "iniciativa", label: "Iniciativa" },
    ],
  },
  {
    grupo: "INT",
    items: [
      { key: "analise_combate", label: "Análise de Combate" },
      { key: "estrategia_tatica", label: "Estratégia Tática" },
      { key: "conhecimento_shinobi", label: "Conhecimento Shinobi" },
      { key: "conhecimento_clas", label: "Conhecimento de Clãs" },
      { key: "fuinjutsu", label: "Fūinjutsu" },
      { key: "sabotagem", label: "Sabotagem" },
    ],
  },
  {
    grupo: "MEN",
    items: [
      { key: "genjutsu", label: "Genjutsu" },
      { key: "resistencia_genjutsu", label: "Resistência a Genjutsu" },
      { key: "concentracao", label: "Concentração" },
      { key: "intimidacao", label: "Intimidação" },
      { key: "vontade_ninja", label: "Vontade Ninja" },
    ],
  },
  {
    grupo: "CON",
    items: [
      { key: "fortitude", label: "Fortitude" },
      { key: "resistencia_fisica", label: "Resistência Física" },
      { key: "recuperacao", label: "Recuperação" },
      { key: "tolerancia_dor", label: "Tolerância à Dor" },
      { key: "sobrevivencia", label: "Sobrevivência" },
    ],
  },
  {
    grupo: "CHA",
    items: [
      { key: "controle_chakra", label: "Controle de Chakra" },
      { key: "moldagem_elemental", label: "Moldagem Elemental" },
      { key: "ninjutsu_medico", label: "Ninjutsu Médico" },
      { key: "sensorial", label: "Sensorial" },
    ],
  },
];

const CharacterSheet = ({ sheet, isOwner, onDelete, onUpdated }: CharacterSheetProps) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({ ...sheet });
  const [saving, setSaving] = useState(false);

  const handleNumberChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: parseInt(value) || 0 }));
  };

  const handleTextChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("character_sheets")
      .update({
        nome: form.nome,
        idade: form.idade,
        elementos: form.elementos,
        classe: form.classe,
        talento: form.talento,
        vida: form.vida,
        vida_max: form.vida_max,
        sanidade: form.sanidade,
        sanidade_max: form.sanidade_max,
        chakra: form.chakra,
        chakra_max: form.chakra_max,
        forca_fisica: form.forca_fisica,
        destreza: form.destreza,
        taijutsu: form.taijutsu,
        forca_bruta: form.forca_bruta,
        imobilizacao: form.imobilizacao,
        acrobacia: form.acrobacia,
        furtividade: form.furtividade,
        shurikenjutsu: form.shurikenjutsu,
        kenjutsu: form.kenjutsu,
        reflexos_ninja: form.reflexos_ninja,
        iniciativa: form.iniciativa,
        analise_combate: form.analise_combate,
        estrategia_tatica: form.estrategia_tatica,
        conhecimento_shinobi: form.conhecimento_shinobi,
        conhecimento_clas: form.conhecimento_clas,
        fuinjutsu: form.fuinjutsu,
        sabotagem: form.sabotagem,
        genjutsu: form.genjutsu,
        resistencia_genjutsu: form.resistencia_genjutsu,
        concentracao: form.concentracao,
        intimidacao: form.intimidacao,
        vontade_ninja: form.vontade_ninja,
        fortitude: form.fortitude,
        resistencia_fisica: form.resistencia_fisica,
        recuperacao: form.recuperacao,
        tolerancia_dor: form.tolerancia_dor,
        sobrevivencia: form.sobrevivencia,
        controle_chakra: form.controle_chakra,
        moldagem_elemental: form.moldagem_elemental,
        ninjutsu_medico: form.ninjutsu_medico,
        sensorial: form.sensorial,
        maestria_fogo: form.maestria_fogo,
        maestria_vento: form.maestria_vento,
        maestria_terra: form.maestria_terra,
        maestria_agua: form.maestria_agua,
        maestria_raio: form.maestria_raio,
        inventario: form.inventario,
      })
      .eq("id", sheet.id);

    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar");
    } else {
      toast.success("Ficha atualizada!");
      setEditing(false);
      onUpdated?.();
    }
  };

  // Collapsed view
  if (!expanded) {
    return (
      <div
        className="retro-panel p-2 mb-2 flex items-center gap-3 cursor-pointer hover:border-accent transition-colors"
        onClick={() => setExpanded(true)}
      >
        {sheet.imagem_url ? (
          <img
            src={sheet.imagem_url}
            alt={sheet.nome}
            className="w-[40px] h-[40px] object-cover border border-border"
          />
        ) : (
          <div className="w-[40px] h-[40px] border border-border flex items-center justify-center text-muted-foreground text-[8px]">
            ?
          </div>
        )}
        <span className="text-accent font-bold text-xs">{sheet.nome}</span>
        <span className="ml-auto text-muted-foreground text-[10px]">▼ expandir</span>
      </div>
    );
  }

  const renderValue = (key: string, type: "number" | "text" = "number") => {
    if (editing && isOwner) {
      return type === "number" ? (
        <input
          type="number"
          className="retro-input w-16 text-center text-xs"
          value={form[key] ?? 0}
          onChange={(e) => handleNumberChange(key, e.target.value)}
        />
      ) : (
        <input
          type="text"
          className="retro-input w-full text-xs"
          value={form[key] ?? ""}
          onChange={(e) => handleTextChange(key, e.target.value)}
        />
      );
    }
    return <span className="retro-value">{(sheet as any)[key] ?? (type === "number" ? 0 : "-")}</span>;
  };

  const renderBar = (key: string, maxKey: string, label: string, color: string) => {
    const current = editing ? (form[key] ?? 0) : ((sheet as any)[key] ?? 0);
    const max = editing ? (form[maxKey] ?? 0) : ((sheet as any)[maxKey] ?? 0);
    const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;

    return (
      <div className="mb-2">
        <div className="flex justify-between text-[11px] mb-1">
          <span className="retro-label font-bold">{label}</span>
          {editing && isOwner ? (
            <span className="flex items-center gap-1">
              <input type="number" className="retro-input w-12 text-center text-[10px]" value={form[key] ?? 0} onChange={(e) => handleNumberChange(key, e.target.value)} />
              <span className="text-muted-foreground">/</span>
              <input type="number" className="retro-input w-12 text-center text-[10px]" value={form[maxKey] ?? 0} onChange={(e) => handleNumberChange(maxKey, e.target.value)} />
            </span>
          ) : (
            <span className="retro-value font-bold">{current}/{max}</span>
          )}
        </div>
        <div className="w-full h-3 border border-border" style={{ background: "hsl(0 0% 5%)" }}>
          <div className="h-full transition-all" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    );
  };

  return (
    <div className="retro-panel p-3 mb-4">
      {/* Header with collapse */}
      <div
        className="flex items-center gap-2 cursor-pointer mb-2"
        onClick={() => { if (!editing) setExpanded(false); }}
      >
        <span className="text-muted-foreground text-[10px]">▲ recolher</span>
        <span className="retro-section-title text-base mb-0 border-0 pb-0 flex-1">{sheet.nome}</span>
      </div>

      {/* Top: Image + Info + Bars */}
      <div className="flex gap-4 flex-wrap">
        {/* Imagem */}
        <div className="shrink-0">
          {sheet.imagem_url ? (
            <img
              src={sheet.imagem_url}
              alt={sheet.nome}
              className="w-[120px] h-[120px] object-cover border-2 border-accent"
            />
          ) : (
            <div className="w-[120px] h-[120px] border-2 border-border flex items-center justify-center text-muted-foreground text-xs">
              Sem Imagem
            </div>
          )}
        </div>

        {/* Info básica + Barras */}
        <div className="flex-1 min-w-[200px]">
          <table className="retro-table text-xs mb-2">
            <tbody>
              <tr><td className="retro-label w-24">Idade:</td><td>{renderValue("idade", "text")}</td></tr>
              <tr><td className="retro-label">Elementos:</td><td>{renderValue("elementos", "text")}</td></tr>
              <tr><td className="retro-label">Classe:</td><td>{renderValue("classe", "text")}</td></tr>
              <tr><td className="retro-label">Talento:</td><td>{renderValue("talento", "text")}</td></tr>
            </tbody>
          </table>

          {/* Barras de Vida/Sanidade/Chakra */}
          {barAtributos.map(({ key, maxKey, label, color }) => (
            <div key={key}>{renderBar(key, maxKey, label, color)}</div>
          ))}
        </div>
      </div>

      {/* Atributos */}
      <div className="mt-3">
        <div className="retro-section-title text-xs">Atributos</div>
        <div className="flex gap-4 flex-wrap">
          {atributos.map(({ key, label }) => (
            <div key={key} className="text-xs retro-atributo-highlight p-2 border border-accent">
              <span className="retro-label">{label}: </span>
              {editing && isOwner ? (
                <input
                  type="number"
                  className="retro-input w-14 text-center text-xs"
                  value={form[key] ?? 0}
                  onChange={(e) => handleNumberChange(key, e.target.value)}
                />
              ) : (
                <span className="text-accent font-bold text-sm">{(sheet as any)[key]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Perícias */}
      <div className="mt-3">
        <div className="retro-section-title text-xs">Perícias</div>
        <div className="retro-panel p-2">
          {pericias.map(({ grupo, items }) => (
            <div key={grupo} className="mb-3">
              <div className="text-accent font-bold text-[11px] border-b border-border pb-1 mb-1">
                {grupo}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                {items.map(({ key, label }) => (
                  <div key={key} className="grid grid-cols-[minmax(0,1fr)_60px] items-center gap-2 text-[11px] py-[2px]">
                    <span className="retro-label leading-tight">{label}:</span>
                    {renderValue(key)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Maestria + Inventário side by side */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="retro-panel p-2">
          <div className="retro-section-title text-xs">Maestria</div>
          {maestrias.map(({ key, label }) => (
            <div key={key} className="flex justify-between text-[11px] items-center mb-1">
              <span className="retro-label">{label}:</span>
              {renderValue(key, "text")}
            </div>
          ))}
        </div>
        <div className="retro-panel p-2">
          <div className="retro-section-title text-xs">Inventário</div>
          {editing && isOwner ? (
            <textarea
              className="retro-input w-full text-xs min-h-[100px]"
              value={form.inventario ?? ""}
              onChange={(e) => handleTextChange("inventario", e.target.value)}
            />
          ) : (
            <div className="text-xs retro-value whitespace-pre-wrap min-h-[40px]">
              {(sheet as any).inventario || "Vazio"}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {isOwner && (
        <div className="mt-3 flex gap-2 justify-end">
          {editing ? (
            <>
              <button
                onClick={() => { setEditing(false); setForm({ ...sheet }); }}
                className="retro-button text-xs"
              >
                ❌ Cancelar
              </button>
              <button
                onClick={handleSave}
                className="retro-button text-xs"
                disabled={saving}
              >
                {saving ? "Salvando..." : "💾 Salvar"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="retro-button text-xs"
              >
                ✏️ Editar
              </button>
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="retro-button text-xs"
                  style={{ background: "linear-gradient(180deg, hsl(0 70% 45%) 0%, hsl(0 70% 30%) 100%)" }}
                >
                  🗑️ Deletar
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CharacterSheet;
