import { FAIXAS, GenjutsuEfeitos, EfeitoGenjutsu, nivelEfeito } from "@/lib/genjutsuEfeitos";

const Tabela = ({ ef, ativo }: { ef: EfeitoGenjutsu; ativo: number }) => (
  <div className="border-2 border-border min-w-0">
    <div className="bg-accent/20 text-accent font-bold text-[11px] px-2 py-1 border-b-2 border-border">{ef.tipo}</div>
    {ef.niveis.map((d, i) => (
      <div
        key={i}
        className={`px-2 py-1 text-[10px] border-b border-border last:border-0 ${ativo === i + 1 ? "bg-accent/30 text-foreground" : "text-muted-foreground"}`}
      >
        <span className="font-bold text-accent">Nível {i + 1}</span> <span className="text-[9px]">({FAIXAS[i]})</span>
        <div className="whitespace-pre-wrap">{d || "—"}</div>
      </div>
    ))}
  </div>
);

const GenjutsuEfeitosView = ({ efeitos, efeitoBase, rank }: { efeitos: GenjutsuEfeitos; efeitoBase: number; rank?: string | null }) => {
  const nivel = nivelEfeito(efeitoBase);
  const grupo = (titulo: string, lista: EfeitoGenjutsu[]) =>
    lista.length > 0 && (
      <div className="mb-2">
        <div className="text-accent font-bold text-[11px] mb-1">{titulo}</div>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(lista.length, 4)}, minmax(0, 1fr))` }}>
          {lista.map((ef, i) => <Tabela key={i} ef={ef} ativo={nivel} />)}
        </div>
      </div>
    );
  return (
    <div className="mt-3">
      <div className="text-[10px] text-muted-foreground mb-2">
        Rank <span className="text-accent font-bold">{rank || "C"}</span> · Efeito Base{" "}
        <span className="text-accent font-bold">{efeitoBase}</span> →{" "}
        <span className="text-accent font-bold">{nivel === 0 ? "Sem efeito" : `Nível ${nivel}`}</span>
      </div>
      {grupo("Efeitos Primários", efeitos.primarios)}
      {grupo("Efeitos Secundários", efeitos.secundarios)}
      {efeitos.primarios.length === 0 && efeitos.secundarios.length === 0 && (
        <p className="text-[10px] text-muted-foreground">Nenhum efeito cadastrado.</p>
      )}
    </div>
  );
};

export default GenjutsuEfeitosView;
