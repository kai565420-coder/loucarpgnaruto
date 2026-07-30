import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";
import StatsIcosagon, { ESTATISTICAS, clampStat } from "@/components/StatsIcosagon";


interface RelatorioWindowProps {
  sheet: any;
  onClose: () => void;
  onUpdated?: () => void;
}

const TEXT_FIELDS: { key: string; label: string }[] = [
  { key: "nome", label: "Nome do Ninja" },
  { key: "alcunha", label: "Alcunha" },
  { key: "idade", label: "Idade" },
  { key: "registro_ninja", label: "Registro Ninja" },
  { key: "reputacao", label: "Reputação" },
  { key: "reconhecimento", label: "Reconhecimento" },
];

const REPUTACOES: { value: string; color: string }[] = [
  { value: "Excelente", color: "#4ade80" },
  { value: "Muito Boa", color: "#22c55e" },
  { value: "Boa", color: "#15803d" },
  { value: "Neutra", color: "#a855f7" },
  { value: "Indefinido", color: "#9ca3af" },
  { value: "Ruim", color: "#f87171" },
  { value: "Muito Ruim", color: "#ef4444" },
  { value: "Péssima", color: "#b91c1c" },
];

const RECONHECIMENTOS: { value: string; stars: number; label: string }[] = [
  { value: "Desconhecido", stars: 0, label: "Desconhecido 0 Estrelas" },
  { value: "Localmente", stars: 1, label: "Localmente 1 Estrela" },
  { value: "Dentro da Aldeia", stars: 2, label: "Dentro da Aldeia 2 Estrelas" },
  { value: "Dentro do País", stars: 3, label: "Dentro do País 3 Estrelas" },
  { value: "Reconhecimento Continental", stars: 4, label: "Reconhecimento Continental 4 Estrelas" },
  { value: "Fama Mundial", stars: 5, label: "Fama Mundial 5 Estrelas" },
];

const MISSOES: { key: string; label: string }[] = [
  { key: "missoes_s", label: "Missões de Rank S" },
  { key: "missoes_a", label: "Missões de Rank A" },
  { key: "missoes_b", label: "Missões de Rank B" },
  { key: "missoes_c", label: "Missões de Rank C" },
  { key: "missoes_d", label: "Missões de Rank D" },
];

const RelatorioWindow = ({ sheet, onClose, onUpdated }: RelatorioWindowProps) => {
  const { isAdminMode } = useAdmin();
  const [form, setForm] = useState<Record<string, any>>({ ...sheet });
  const [saving, setSaving] = useState(false);

  const total = MISSOES.reduce((acc, m) => acc + (Number(form[m.key]) || 0), 0);

  const handleSave = async () => {
    setSaving(true);
    const payload: Record<string, any> = {
      nome: form.nome ?? "",
      idade: form.idade ?? "",
      alcunha: form.alcunha ?? "",
      registro_ninja: form.registro_ninja ?? "",
      reputacao: form.reputacao ?? "",
      reconhecimento: form.reconhecimento ?? "",
    };
    MISSOES.forEach((m) => (payload[m.key] = Number(form[m.key]) || 0));
    ESTATISTICAS.forEach((e) => (payload[e.key] = clampStat(form[e.key])));


    const { error } = await supabase.from("character_sheets").update(payload).eq("id", sheet.id);
    setSaving(false);
    if (error) {
      toast.error("Erro: " + error.message);
      return;
    }
    toast.success("Relatório salvo!");
    onUpdated?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 bg-card border-2 border-accent w-full max-w-[420px] max-h-[85vh] overflow-y-auto">
        <div className="retro-header-bar flex items-center justify-between px-2 py-1">
          <span className="text-[11px] text-primary-foreground">📋 Relatório Ninja</span>
          <button className="text-[11px] text-primary-foreground px-1" onClick={onClose}>✕</button>
        </div>

        <div className="p-3">
          <table className="retro-table text-xs w-full mb-3">
            <tbody>
              {TEXT_FIELDS.map(({ key, label }) => {
                const rep = REPUTACOES.find((r) => r.value === form.reputacao);
                const rec = RECONHECIMENTOS.find((r) => r.value === form.reconhecimento);
                return (
                <tr key={key}>
                  <td className="retro-label w-32">{label}:</td>
                  <td>
                    {key === "reputacao" ? (
                      isAdminMode ? (
                        <select
                          className="retro-input w-full text-[11px]"
                          value={form.reputacao ?? ""}
                          onChange={(e) => setForm((p) => ({ ...p, reputacao: e.target.value }))}
                        >
                          <option value="">—</option>
                          {REPUTACOES.map((r) => (
                            <option key={r.value} value={r.value}>{r.value}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-[11px] font-bold" style={{ color: rep?.color }}>
                          {form.reputacao || "—"}
                        </span>
                      )
                    ) : key === "reconhecimento" ? (
                      isAdminMode ? (
                        <select
                          className="retro-input w-full text-[11px]"
                          value={form.reconhecimento ?? ""}
                          onChange={(e) => setForm((p) => ({ ...p, reconhecimento: e.target.value }))}
                        >
                          <option value="">—</option>
                          {RECONHECIMENTOS.map((r) => (
                            <option key={r.value} value={r.value}>{r.value}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-[11px] font-bold text-accent">
                          {rec && rec.stars > 0
                            ? "★".repeat(rec.stars) + "☆".repeat(5 - rec.stars) + `  ${rec.value}`
                            : rec
                            ? "☆☆☆☆☆"
                            : "—"}
                        </span>
                      )
                    ) : isAdminMode ? (
                      <input
                        type="text"
                        className="retro-input w-full text-[11px]"
                        value={form[key] ?? ""}
                        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      />
                    ) : (
                      <span className="text-[11px]">{form[key] || "—"}</span>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>

          <div className="retro-section-title text-xs">Missões Completas</div>
          <table className="retro-table text-xs w-full">
            <tbody>
              {MISSOES.map(({ key, label }) => (
                <tr key={key}>
                  <td className="retro-label w-32">{label}:</td>
                  <td>
                    {isAdminMode ? (
                      <input
                        type="number"
                        className="retro-input w-20 text-[11px]"
                        value={form[key] ?? 0}
                        onChange={(e) => setForm((p) => ({ ...p, [key]: parseInt(e.target.value) || 0 }))}
                      />
                    ) : (
                      <span className="text-[11px] font-bold text-accent">{Number(form[key]) || 0}</span>
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="retro-label w-32">Total:</td>
                <td className="text-[11px] font-bold text-accent">{total}</td>
              </tr>
            </tbody>
          </table>

          <div className="retro-section-title text-xs mt-3">Estatísticas Ninja</div>
          <StatsIcosagon
            values={form}
            editing={isAdminMode}
            onChange={(k, v) => setForm((p) => ({ ...p, [k]: v }))}
          />



          {isAdminMode && (
            <div className="flex gap-2 mt-3">
              <button className="retro-button flex-1 text-xs py-1" onClick={onClose}>Fechar</button>
              <button className="retro-button flex-1 text-xs py-1" onClick={handleSave} disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatorioWindow;
