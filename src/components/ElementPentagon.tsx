interface ElementPentagonProps {
  values: Record<string, number>;
  editing: boolean;
  canEdit: boolean;
  onChange: (key: string, value: number) => void;
}

export const ELEMENTOS = [
  { key: "fogo", label: "Fogo", icon: "https://i.imgur.com/x8Nckrr.png" },
  { key: "vento", label: "Vento", icon: "https://i.imgur.com/g4L1VBn.png" },
  { key: "raio", label: "Raio", icon: "https://i.imgur.com/Tm6oI2L.png" },
  { key: "terra", label: "Terra", icon: "https://i.imgur.com/hHdV2jX.png" },
  { key: "agua", label: "Água", icon: "https://i.imgur.com/NWSExiv.png" },
];

const SIZE = 260;
const CX = SIZE / 2;
const CY = SIZE / 2 + 6;
const R = 82;

const point = (i: number, ratio: number) => {
  const angle = (-90 + i * 72) * (Math.PI / 180);
  return [CX + Math.cos(angle) * R * ratio, CY + Math.sin(angle) * R * ratio];
};

const polygon = (ratios: number[]) =>
  ratios.map((r, i) => point(i, r).join(",")).join(" ");

const clamp = (n: number) => Math.max(0, Math.min(100, isNaN(n) ? 0 : n));

const ElementPentagon = ({ values, editing, canEdit, onChange }: ElementPentagonProps) => {
  const afinidade = ELEMENTOS.map((e) => clamp(values[`afinidade_${e.key}`] ?? 0) / 100);
  const dominio = ELEMENTOS.map((e) => clamp(values[`dominio_${e.key}`] ?? 0) / 100);

  return (
    <div>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[280px] mx-auto block">
        {/* grid */}
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <polygon
            key={r}
            points={polygon([r, r, r, r, r])}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={1}
          />
        ))}
        {ELEMENTOS.map((_, i) => {
          const [x, y] = point(i, 1);
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="hsl(var(--border))" strokeWidth={1} />;
        })}

        {/* dominio */}
        <polygon
          points={polygon(dominio)}
          fill="hsl(200 80% 50% / 0.25)"
          stroke="hsl(200 80% 55%)"
          strokeWidth={2}
        />
        {/* afinidade */}
        <polygon
          points={polygon(afinidade)}
          fill="hsl(var(--accent) / 0.25)"
          stroke="hsl(var(--accent))"
          strokeWidth={2}
        />

        {/* icons */}
        {ELEMENTOS.map((e, i) => {
          const [x, y] = point(i, 1.32);
          return (
            <image
              key={e.key}
              href={e.icon}
              x={x - 16}
              y={y - 16}
              width={32}
              height={32}
            />
          );
        })}
      </svg>

      <div className="flex items-center justify-center gap-4 text-[10px] mt-1 mb-2">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-2 bg-accent" /> Afinidade
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-2" style={{ background: "hsl(200 80% 55%)" }} /> Domínio
        </span>
      </div>

      <div className="space-y-1">
        {ELEMENTOS.map((e) => {
          const af = clamp(values[`afinidade_${e.key}`] ?? 0);
          const dm = clamp(values[`dominio_${e.key}`] ?? 0);
          return (
            <div key={e.key} className="grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2 text-[11px]">
              <img src={e.icon} alt={e.label} className="w-5 h-5 object-contain" />
              <span className="retro-label leading-tight">{e.label}</span>
              {editing && canEdit ? (
                <span className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="retro-input w-14 text-[11px]"
                    value={af}
                    onChange={(ev) => onChange(`afinidade_${e.key}`, clamp(parseInt(ev.target.value, 10)))}
                  />
                  <span className="text-muted-foreground">/</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="retro-input w-14 text-[11px]"
                    value={dm}
                    onChange={(ev) => onChange(`dominio_${e.key}`, clamp(parseInt(ev.target.value, 10)))}
                  />
                </span>
              ) : (
                <span className="text-right leading-tight">
                  <span className="text-accent font-bold">{af}%</span>
                  <span className="text-muted-foreground"> / </span>
                  <span className="font-bold" style={{ color: "hsl(200 80% 55%)" }}>{dm}%</span>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElementPentagon;
