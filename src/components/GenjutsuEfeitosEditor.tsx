import { TIPOS_EFEITO, RANKS, MAX_PRIMARIOS, GenjutsuEfeitos, EfeitoGenjutsu, novoEfeito, FAIXAS } from "@/lib/genjutsuEfeitos";

interface Props {
  rank: string;
  setRank: (r: string) => void;
  efeitoBase: string;
  setEfeitoBase: (v: string) => void;
  efeitos: GenjutsuEfeitos;
  setEfeitos: (e: GenjutsuEfeitos) => void;
}

const GenjutsuEfeitosEditor = ({ rank, setRank, efeitoBase, setEfeitoBase, efeitos, setEfeitos }: Props) => {
  const max = MAX_PRIMARIOS[rank] ?? 1;

  const update = (grp: keyof GenjutsuEfeitos, idx: number, ef: EfeitoGenjutsu) =>
    setEfeitos({ ...efeitos, [grp]: efeitos[grp].map((e, i) => (i === idx ? ef : e)) });
  const remove = (grp: keyof GenjutsuEfeitos, idx: number) =>
    setEfeitos({ ...efeitos, [grp]: efeitos[grp].filter((_, i) => i !== idx) });
  const add = (grp: keyof GenjutsuEfeitos) => setEfeitos({ ...efeitos, [grp]: [...efeitos[grp], novoEfeito()] });

  const grupo = (grp: keyof GenjutsuEfeitos, titulo: string, podeAdd: boolean) => (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-accent font-bold text-[11px]">{titulo}</span>
        <button type="button" disabled={!podeAdd} onClick={() => add(grp)} className="retro-button text-[10px] px-2 py-0.5 disabled:opacity-40">
          + Adicionar
        </button>
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(1, Math.min(efeitos[grp].length, 2))}, minmax(0, 1fr))` }}>
      {efeitos[grp].map((ef, idx) => (
        <div key={idx} className="border border-border p-2">
          <div className="flex gap-2 mb-1">
            <select className="retro-input flex-1 text-xs" value={ef.tipo} onChange={(e) => update(grp, idx, { ...ef, tipo: e.target.value })}>
              {TIPOS_EFEITO.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <button type="button" onClick={() => remove(grp, idx)} className="text-[10px] text-muted-foreground hover:text-destructive">🗑️</button>
          </div>
          {ef.niveis.map((d, n) => (
            <div key={n} className="mb-1">
              <label className="retro-label block text-[10px]">Nível {n + 1} ({FAIXAS[n]} pts):</label>
              <textarea
                className="retro-input w-full text-xs min-h-[36px]"
                value={d}
                onChange={(e) => {
                  const niveis = [...ef.niveis] as EfeitoGenjutsu["niveis"];
                  niveis[n] = e.target.value;
                  update(grp, idx, { ...ef, niveis });
                }}
              />
            </div>
          ))}
        </div>
      ))}
      </div>
    </div>
  );

  return (
    <div className="mb-3 border-2 border-accent/50 p-2">
      <div className="retro-section-title text-xs">👁️ Efeitos do Genjutsu</div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="retro-label block mb-1">Rank:</label>
          <select className="retro-input w-full text-xs" value={rank} onChange={(e) => setRank(e.target.value)}>
            {RANKS.map((r) => <option key={r} value={r}>Rank {r} (máx. {MAX_PRIMARIOS[r]} primário{MAX_PRIMARIOS[r] > 1 ? "s" : ""})</option>)}
          </select>
        </div>
        <div>
          <label className="retro-label block mb-1">Efeito Base:</label>
          <input type="number" min={0} className="retro-input w-full text-xs" value={efeitoBase} onChange={(e) => setEfeitoBase(e.target.value)} />
        </div>
      </div>
      {efeitos.primarios.length > max && (
        <p className="text-[10px] text-destructive mb-1">Este rank permite no máximo {max} primário(s). Remova os excedentes.</p>
      )}
      {grupo("primarios", `Tipos Primários (${efeitos.primarios.length}/${max})`, efeitos.primarios.length < max)}
      {grupo("secundarios", `Tipos Secundários (${efeitos.secundarios.length})`, true)}
    </div>
  );
};

export default GenjutsuEfeitosEditor;
