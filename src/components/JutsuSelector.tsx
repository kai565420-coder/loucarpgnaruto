import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface JutsuSelectorProps {
  characterId: string;
  assignedJutsuIds: string[];
  onChanged: () => void;
  onClose: () => void;
}

interface Jutsu {
  id: string;
  nome: string;
}

const JutsuSelector = ({ characterId, assignedJutsuIds, onChanged, onClose }: JutsuSelectorProps) => {
  const [allJutsus, setAllJutsus] = useState<Jutsu[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set(assignedJutsuIds));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("jutsus")
      .select("id, nome")
      .order("nome")
      .then(({ data }) => setAllJutsus(data || []));
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Remove all current
      await supabase.from("character_jutsus").delete().eq("character_id", characterId);

      // Insert selected
      if (selected.size > 0) {
        const rows = Array.from(selected).map((jutsu_id) => ({
          character_id: characterId,
          jutsu_id,
        }));
        const { error } = await supabase.from("character_jutsus").insert(rows);
        if (error) throw error;
      }

      toast.success("Habilidades atualizadas!");
      onChanged();
      onClose();
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="retro-panel p-3">
      <div className="retro-section-title text-xs">Adicionar Habilidades</div>
      {allJutsus.length === 0 ? (
        <p className="text-muted-foreground text-[11px]">Nenhuma habilidade cadastrada. Crie uma primeiro!</p>
      ) : (
        <div className="max-h-[200px] overflow-y-auto mb-2">
          {allJutsus.map((j) => (
            <label
              key={j.id}
              className="flex items-center gap-2 text-xs py-1 px-1 cursor-pointer hover:bg-muted"
            >
              <input
                type="checkbox"
                checked={selected.has(j.id)}
                onChange={() => toggle(j.id)}
                className="accent-[hsl(25,100%,50%)]"
              />
              <span className="text-foreground">{j.nome}</span>
            </label>
          ))}
        </div>
      )}
      <div className="flex gap-2 justify-end">
        <button onClick={onClose} className="retro-button text-xs">
          Cancelar
        </button>
        <button onClick={handleSave} className="retro-button text-xs" disabled={saving}>
          {saving ? "Salvando..." : "✅ Salvar"}
        </button>
      </div>
    </div>
  );
};

export default JutsuSelector;
