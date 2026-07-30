interface StatsIcosagonProps {
  values: Record<string, any>;
  editing: boolean;
  onChange: (key: string, value: number) => void;
}

export const ESTATISTICAS: { key: string; label: string; short?: string }[] = [
  { key: "est_taijutsu", label: "Taijutsu", short: "Taijutsu" },
  { key: "est_ninjutsu", label: "Ninjutsu", short: "Ninjutsu" },
  { key: "est_yin", label: "Compreensão de Yin (Genjutsu)", short: "Yin" },
  { key: "est_yang", label: "Compreensão de Yang", short: "Yang" },
  { key: "est_bukijutsu", label: "Bukijutsu", short: "Bukijutsu" },
  { key: "est_kenjutsu", label: "Kenjutsu", short: "Kenjutsu" },
  { key: "est_fuinjutsu", label: "Fūinjutsu", short: "Fūinjutsu" },
  { key: "est_selos_mao", label: "Selos de Mão", short: "Selos" },
  { key: "est_qtd_chakra", label: "Quantidade de Chakra", short: "Qtd. Chakra" },
  { key: "est_controle_chakra", label: "Controle de Chakra", short: "Ctrl. Chakra" },
  { key: "est_forca_fisica", label: "Força Física", short: "Força" },
  { key: "est_destreza", label: "Destreza", short: "Destreza" },
  { key: "est_resistencia", label: "Resistência", short: "Resist." },
  { key: "est_vigor", label: "Vigor", short: "Vigor" },
  { key: "est_velocidade", label: "Velocidade", short: "Veloc." },
  { key: "est_inteligencia", label: "Inteligência", short: "Intel." },
  { key: "est_int_combate", label: "Inteligência de Combate", short: "Int. Combate" },
  { key: "est_trabalho_equipe", label: "Trabalho em Equipe", short: "Equipe" },
  { key: "est_infiltracao", label: "Infiltração", short: "Infiltr." },
  { key: "est_adaptacao", label: "Adaptação", short: "Adapt." },
];

const N = ESTATISTICAS.length;
const SIZE = 340;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 100;
const LABEL_R = R + 16;
const MIN_RATIO = 0.03;

export const clampStat = (n: any) => {
  const v = typeof n === "number" ? n : parseFloat(String(n).replace(",", "."));
  if (isNaN(v)) return 0;
  return Math.max(0, Math.min(5, Math.round(v * 10) / 10));
};

const point = (i: number, ratio: number) => {
  const angle = (-90 + i * (360 / N)) * (Math.PI / 180);
  return [CX + Math.cos(angle) * R * ratio, CY + Math.sin(angle) * R * ratio];
};

const polygon = (ratios: number[]) => ratios.map((r, i) => point(i, r).join(",")).join(" ");

const StatsIcosagon = ({ values, editing, onChange }: StatsIcosagonProps) => {
  const nums = ESTATISTICAS.map((e) => clampStat(values[e.key] ?? 0));
  const soma = nums.reduce((a, b) => a + b, 0);
  const media = soma / N;
  const data = nums.map((v) => Math.max(MIN_RATIO, v / 5));

  return (
    <div>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[360px] mx-auto block">
        {[0.2, 0.4, 0.6, 0.8, 1].map((r) => (
          <polygon
            key={r}
            points={polygon(Array(N).fill(r))}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={1}
          />
        ))}
        {ESTATISTICAS.map((_, i) => {
          const [x, y] = point(i, 1);
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="hsl(var(--border))" strokeWidth={0.75} />;
        })}
        <polygon
          points={polygon(data)}
          fill="hsl(var(--accent) / 0.25)"
          stroke="hsl(var(--accent))"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {data.map((r, i) => {
          const [x, y] = point(i, r);
          return <circle key={`p-${i}`} cx={x} cy={y} r={2} fill="hsl(var(--accent))" />;
        })}
        {ESTATISTICAS.map((e, i) => {
          const angle = (-90 + i * (360 / N)) * (Math.PI / 180);
          const x = CX + Math.cos(angle) * LABEL_R;
          const y = CY + Math.sin(angle) * LABEL_R;
          const cos = Math.cos(angle);
          const anchor = Math.abs(cos) < 0.2 ? "middle" : cos > 0 ? "start" : "end";
          return (
            <text
              key={`l-${i}`}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={9}
              fill="hsl(var(--muted-foreground))"
              fontFamily="monospace"
            >
              {e.short ?? e.label} {nums[i].toFixed(1)}
            </text>
          );
        })}
      </svg>

      <table className="retro-table text-xs w-full mt-2">
        <tbody>
          {ESTATISTICAS.map((e, i) => (
            <tr key={e.key}>
              <td className="retro-label">{e.label}:</td>
              <td className="w-20 text-right">
                {editing ? (
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    className="retro-input w-16 text-[11px]"
                    value={values[e.key] ?? 0}
                    onChange={(ev) => onChange(e.key, clampStat(ev.target.value))}
                  />
                ) : (
                  <span className="text-[11px] font-bold text-accent">{nums[i].toFixed(1)}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="border-2 border-accent bg-accent/10 p-2 text-center">
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Soma Total</div>
          <div className="text-lg font-bold text-accent leading-none mt-1">{soma.toFixed(1)}</div>
        </div>
        <div className="border-2 border-accent bg-accent p-2 text-center">
          <div className="text-[9px] uppercase tracking-wider text-accent-foreground">Resultado Ninja</div>
          <div className="text-lg font-bold text-accent-foreground leading-none mt-1">{media.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default StatsIcosagon;
