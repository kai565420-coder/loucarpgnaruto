import ResizableWindow from "./ResizableWindow";
import { calcularTatica, fmtMod, ALCANCES, ALCANCE_TAIJUTSU, ALCANCE_GENJUTSU } from "@/lib/jutsuTatica";
import { getJutsuEmoji } from "@/lib/jutsuEmoji";

interface Jutsu {
  id: string;
  nome: string;
  informacoes: string;
  imagem_url: string | null;
  qtd_selos?: number | null;
  alcance?: string | null;
  dt_captura?: number | null;
  categoria?: string | null;
}

export interface JutsuTaticaContext {
  personagem: string;
  maestria: string;
  selosManuais: string;
  taijutsu?: number;
  controleChakra?: number;
}

interface JutsuWindowProps {
  jutsu: Jutsu;
  onClose: () => void;
  onMinimize: () => void;
  initialPosition?: { x: number; y: number };
  tatica?: JutsuTaticaContext;
}

const renderBoldText = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-accent text-sm">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

const JutsuWindow = ({ jutsu, onClose, onMinimize, initialPosition, tatica }: JutsuWindowProps) => {
  const isInvocacao = jutsu.categoria === "invocacao";
  const resultado = tatica && !isInvocacao
    ? calcularTatica({
        alcance: jutsu.alcance || "",
        qtdSelos: jutsu.qtd_selos ?? 0,
        maestria: tatica.maestria,
        selosManuais: tatica.selosManuais,
        taijutsu: tatica.taijutsu,
        controleChakra: tatica.controleChakra,
        dtCaptura: jutsu.dt_captura ?? 0,
      })
    : null;

  const alcanceLabel =
    jutsu.alcance === "taijutsu"
      ? ALCANCE_TAIJUTSU.label
      : jutsu.alcance === "genjutsu"
      ? ALCANCE_GENJUTSU.label
      : ALCANCES.find((a) => a.id === jutsu.alcance)?.label;

  return (
    <ResizableWindow
      title={jutsu.nome}
      icon={getJutsuEmoji(jutsu.nome)}
      onClose={onClose}
      onMinimize={onMinimize}
      initialPosition={initialPosition}
    >
      {jutsu.imagem_url && (
        <img src={jutsu.imagem_url} alt={jutsu.nome} className="w-full max-h-[200px] object-contain border border-border mb-3" />
      )}
      <div className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
        {renderBoldText(jutsu.informacoes || "Sem informações.")}
      </div>

      {tatica && !isInvocacao && (
        <div className="mt-4 border-t-2 border-accent/50 pt-2">
          <div className="retro-section-title text-xs">
            {resultado?.genjutsu ? "👁️ Genjutsu" : resultado?.taijutsu ? "💪 Taijutsu" : "⚔️ Moldagem Elemental"} — {tatica.personagem}
          </div>

          {!resultado ? (
            <p className="text-[10px] text-muted-foreground">
              Defina o <b>Alcance</b> desta habilidade no cadastro para calcular os modificadores.
            </p>
          ) : (
            <>
              <div className="text-[10px] text-muted-foreground mb-2 leading-relaxed">
                {resultado.genjutsu ? (
                  <>
                    <div>
                      Alcance: <span className="text-accent font-bold">Sem limite (Genjutsu)</span> · Selos:{" "}
                      <span className="text-accent font-bold">
                        {resultado.selosBase}
                        {resultado.selosEfetivos !== resultado.selosBase && ` → ${resultado.selosEfetivos}`}
                      </span>
                    </div>
                    <div>{resultado.selosCountLabel} → {fmtMod(resultado.selosCountMod)}</div>
                    <div>
                      Selos Manuais {tatica.selosManuais || "—"} → {fmtMod(resultado.selosManuaisMod)}
                      {resultado.selosEfetivos === 0 && " (não acumula com 0 selos)"}
                    </div>
                    <div className="mt-1">
                      Controle de Chakra <span className="text-accent font-bold">{resultado.controleChakra}</span> + DT de Captura{" "}
                      <span className="text-accent font-bold">{resultado.dtCaptura}</span>
                      {resultado.bonusTotal !== 0 && <> {resultado.bonusTotal > 0 ? "−" : "+"} {Math.abs(resultado.bonusTotal)} (selos)</>}
                    </div>
                    <div className="text-accent font-bold text-xs mt-1">
                      DT total de captura: {resultado.capturaTotal}
                      {resultado.vantagem && " · oponente com vantagem de roll"}
                    </div>
                    <div className="mt-1">
                      O oponente resiste com <b>Conhecimento Shinobi</b> (ou <b>Conhecimento de Clãs</b>) contra essa DT.
                    </div>
                  </>
                ) : resultado.taijutsu ? (
                  <>
                    <div>
                      Alcance base: <span className="text-accent font-bold">{alcanceLabel}</span> · Sem selos manuais
                    </div>
                    <div className="text-accent font-bold">
                      Perícia de Taijutsu: {resultado.taijutsuValor} → penalidade nos Reflexos Ninja do oponente,
                      reduzindo 1 por faixa de distância
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      Alcance base: <span className="text-accent font-bold">{alcanceLabel}</span> · Selos:{" "}
                      <span className="text-accent font-bold">
                        {resultado.selosBase}
                        {resultado.selosEfetivos !== resultado.selosBase && ` → ${resultado.selosEfetivos}`}
                      </span>{" "}
                      {resultado.selosEfetivos !== resultado.selosBase && (
                        <span>
                          (Maestria {tatica.maestria === "Nula" ? "—" : tatica.maestria})
                        </span>
                      )}
                    </div>
                    <div>{resultado.selosCountLabel} → {fmtMod(resultado.selosCountMod)}</div>
                    <div>
                      Selos Manuais {tatica.selosManuais || "—"} → {fmtMod(resultado.selosManuaisMod)}
                      {resultado.selosEfetivos === 0 && " (não acumula com 0 selos)"}
                    </div>
                    <div className="text-accent font-bold">
                      Ajuste fixo aplicado: {fmtMod(resultado.bonusTotal)} nos Reflexos Ninja do oponente
                      {resultado.vantagem && " · oponente com vantagem de roll"}
                    </div>
                  </>
                )}
              </div>


              {!resultado.genjutsu && (
              <>
              <table className="retro-table text-[10px] w-full">
                <thead>
                  <tr>
                    <th className="text-left">Distância do alvo</th>
                    <th className="text-center">Reflexos do oponente</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.linhas.map((l) => (
                    <tr key={l.label}>
                      <td className="align-top">
                        <span className={l.obs === "Alcance base do jutsu" ? "text-accent font-bold" : ""}>{l.label}</span>
                        <div className="text-[9px] text-muted-foreground">{l.dist}</div>
                      </td>
                      <td className="align-top text-center">
                        {l.total === null ? (
                          <span className="text-muted-foreground font-bold">—</span>
                        ) : l.total === 0 ? (
                          <span className="text-muted-foreground font-bold">Nada</span>
                        ) : (
                          <span className={l.total < 0 ? "text-green-400 font-bold" : "text-destructive font-bold"}>
                            {fmtMod(l.total)}
                          </span>
                        )}
                        {l.obs && l.obs !== "Alcance base do jutsu" && (
                          <div className="text-[9px] text-muted-foreground">{l.obs}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[9px] text-muted-foreground mt-1">
                Valores negativos = mais difícil para o oponente esquivar (vantagem sua).
              </p>
              </>
              )}
            </>
          )}
        </div>
      )}
    </ResizableWindow>
  );
};

export default JutsuWindow;
