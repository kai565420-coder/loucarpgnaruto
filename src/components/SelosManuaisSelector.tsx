import { useState } from "react";

const SELOS_MANUAIS = [
  {
    id: "I",
    label: "Selos Manuais I",
    descricao: "Velocidade inicial, seu oponente consegue notar que um jutsu será formado, ele recebe +2 no teste de \"Reflexos Ninjas\".",
  },
  {
    id: "II",
    label: "Selos Manuais II",
    descricao: "Considerado a velocidade de um Chunnin, o personagem já consegue executar com maior velocidade, não dando nenhuma vantagem a seu oponente.",
  },
  {
    id: "III",
    label: "Selos Manuais III",
    descricao: "Considerado a velocidade de um Jounin, o personagem consegue executar selos tão rápidos que seu oponente recebe -2 no teste de \"Reflexos Ninjas\".",
  },
  {
    id: "IV",
    label: "Selos Manuais IV",
    descricao: "Ápice ninja, a velocidade de seus selos é tanta que é quase impossível notar o selo sendo feito, seu oponente recebe -5 no teste de \"Reflexos Ninjas\".",
  },
];

interface SelosManuaisSelectorProps {
  value: string; // comma-separated IDs
  onChange: (value: string) => void;
  editing: boolean;
  canEdit: boolean;
}

const SelosManuaisSelector = ({ value, onChange, editing, canEdit }: SelosManuaisSelectorProps) => {
  const [expandedSelo, setExpandedSelo] = useState<string | null>(null);

  const selectedIds = value ? value.split(",").filter(Boolean) : [];

  const toggleSelo = (id: string) => {
    if (!editing || !canEdit) return;
    let newIds: string[];
    if (selectedIds.includes(id)) {
      newIds = selectedIds.filter((s) => s !== id);
    } else {
      if (selectedIds.length >= 4) return;
      newIds = [...selectedIds, id];
    }
    onChange(newIds.join(","));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {SELOS_MANUAIS.map((selo) => {
          const isSelected = selectedIds.includes(selo.id);
          return (
            <div key={selo.id} className="relative">
              <button
                type="button"
                onClick={() => {
                  if (editing && canEdit) {
                    toggleSelo(selo.id);
                  } else {
                    setExpandedSelo(expandedSelo === selo.id ? null : selo.id);
                  }
                }}
                className={`text-[9px] px-1.5 py-0.5 border transition-colors ${
                  isSelected
                    ? "border-accent bg-accent/20 text-accent font-bold"
                    : "border-border text-muted-foreground hover:border-accent/50"
                }`}
                title={selo.descricao}
              >
                {selo.label}
              </button>
              {expandedSelo === selo.id && !editing && (
                <div className="absolute z-20 top-full left-0 mt-1 w-[200px] bg-card border border-border p-2 text-[10px] text-foreground shadow-lg">
                  <div className="font-bold text-accent mb-1">{selo.label}</div>
                  <p>{selo.descricao}</p>
                  <button onClick={() => setExpandedSelo(null)} className="text-[9px] text-muted-foreground hover:text-accent mt-1">Fechar</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {editing && canEdit && (
        <div className="text-[9px] text-muted-foreground mt-1">Clique para selecionar (máx. 4)</div>
      )}
    </div>
  );
};

export default SelosManuaisSelector;
