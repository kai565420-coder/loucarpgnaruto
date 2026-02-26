import type { Tables } from "@/integrations/supabase/types";

interface CharacterSheetProps {
  sheet: Tables<"character_sheets">;
  isOwner: boolean;
  onDelete?: () => void;
}

const atributosDestaque = [
  { key: "vida", label: "Vida" },
  { key: "sanidade", label: "Sanidade" },
  { key: "forca_fisica", label: "Força Física" },
  { key: "destreza", label: "Destreza" },
  { key: "chakra", label: "Chakra" },
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

const CharacterSheet = ({ sheet, isOwner, onDelete }: CharacterSheetProps) => {
  return (
    <div className="retro-panel p-3 mb-4">
      <div className="flex gap-4">
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

        {/* Info básica */}
        <div className="flex-1">
          <div className="retro-section-title text-base mb-2">{sheet.nome}</div>
          <table className="retro-table text-xs">
            <tbody>
              <tr><td className="retro-label w-24">Idade:</td><td className="retro-value">{sheet.idade || "-"}</td></tr>
              <tr><td className="retro-label">Elementos:</td><td className="retro-value">{sheet.elementos || "-"}</td></tr>
              <tr><td className="retro-label">Classe:</td><td className="retro-value">{sheet.classe || "-"}</td></tr>
              <tr><td className="retro-label">Talento:</td><td className="retro-value">{sheet.talento || "-"}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Atributos Destaque */}
      <div className="mt-3">
        <div className="retro-section-title text-xs">Atributos (Destaque)</div>
        <div className="flex gap-4 flex-wrap">
          {atributosDestaque.map(({ key, label }) => (
            <div key={key} className="text-xs">
              <span className="retro-label">{label}: </span>
              <span className="text-accent font-bold">{(sheet as any)[key]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Perícias */}
      <div className="mt-3">
        <div className="retro-section-title text-xs">Perícias</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {pericias.map(({ grupo, items }) => (
            <div key={grupo}>
              <div className="text-accent font-bold text-[11px] border-b border-border pb-1 mb-1">
                {grupo}
              </div>
              {items.map(({ key, label }) => (
                <div key={key} className="flex justify-between text-[11px]">
                  <span className="retro-label">{label}</span>
                  <span className="retro-value">{(sheet as any)[key]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {isOwner && onDelete && (
        <div className="mt-3 text-right">
          <button
            onClick={onDelete}
            className="retro-button text-xs"
            style={{ background: "linear-gradient(180deg, hsl(0 70% 45%) 0%, hsl(0 70% 30%) 100%)" }}
          >
            🗑️ Deletar Ficha
          </button>
        </div>
      )}
    </div>
  );
};

export default CharacterSheet;
