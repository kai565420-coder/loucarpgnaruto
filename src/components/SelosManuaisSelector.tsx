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
  value: string;
  onChange: (value: string) => void;
  editing: boolean;
  canEdit: boolean;
}

const SelosManuaisSelector = ({ value, onChange, editing, canEdit }: SelosManuaisSelectorProps) => {
  const [showDesc, setShowDesc] = useState(false);

  const currentSelo = SELOS_MANUAIS.find((s) => s.id === value) || null;

  if (editing && canEdit) {
    return (
      <div>
        <select
          className="retro-input text-[10px] w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Nenhum</option>
          {SELOS_MANUAIS.map((selo) => (
            <option key={selo.id} value={selo.id}>{selo.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (!currentSelo) {
    return <span className="text-muted-foreground text-[10px]">Nenhum</span>;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowDesc(!showDesc)}
        className="text-[10px] px-1.5 py-0.5 border border-accent bg-accent/20 text-accent font-bold cursor-pointer"
      >
        {currentSelo.label}
      </button>
      {showDesc && (
        <div className="absolute z-20 top-full left-0 mt-1 w-[220px] bg-card border border-border p-2 text-[10px] text-foreground shadow-lg">
          <div className="font-bold text-accent mb-1">{currentSelo.label}</div>
          <p>{currentSelo.descricao}</p>
          <button onClick={() => setShowDesc(false)} className="text-[9px] text-muted-foreground hover:text-accent mt-1">Fechar</button>
        </div>
      )}
    </div>
  );
};

export default SelosManuaisSelector;
