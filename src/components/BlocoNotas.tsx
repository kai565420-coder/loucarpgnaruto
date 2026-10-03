import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Topico {
  id: string;
  titulo: string;
  texto: string;
}

const novoId = () => Math.random().toString(36).slice(2, 10);

const BlocoNotas = ({ characterId, canEdit }: { characterId: string; canEdit: boolean }) => {
  const [open, setOpen] = useState(false);
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [ativo, setAtivo] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!open) return;
    supabase
      .from("character_sheets")
      .select("notas")
      .eq("id", characterId)
      .single()
      .then(({ data }) => {
        const list = Array.isArray((data as any)?.notas) ? ((data as any).notas as Topico[]) : [];
        setTopicos(list);
        setAtivo(list[0]?.id ?? null);
        setDirty(false);
      });
  }, [open, characterId]);

  const update = (list: Topico[]) => {
    setTopicos(list);
    setDirty(true);
  };

  const salvar = async () => {
    setSaving(true);
    const { error } = await supabase.from("character_sheets").update({ notas: topicos as any }).eq("id", characterId);
    setSaving(false);
    if (error) return toast.error("Erro ao salvar notas: " + error.message);
    setDirty(false);
    toast.success("Notas salvas!");
  };

  const adicionar = () => {
    const t = { id: novoId(), titulo: `Tópico ${topicos.length + 1}`, texto: "" };
    update([...topicos, t]);
    setAtivo(t.id);
  };

  const remover = (id: string) => {
    if (!confirm("Excluir este tópico?")) return;
    const list = topicos.filter((t) => t.id !== id);
    update(list);
    if (ativo === id) setAtivo(list[0]?.id ?? null);
  };

  const atual = topicos.find((t) => t.id === ativo);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="retro-btn text-[11px] px-2 py-0.5">
        📝 Bloco de Notas
      </button>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o && dirty && !confirm("Há alterações não salvas. Fechar mesmo assim?")) return;
          setOpen(o);
        }}
      >
        <DialogContent className="max-w-3xl font-mono">
          <DialogHeader>
            <DialogTitle className="text-accent">📝 Bloco de Notas</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-3 min-h-[360px]">
            <div className="sm:w-48 flex flex-col gap-1 border border-border p-1 max-h-[360px] overflow-y-auto">
              {topicos.length === 0 && <div className="text-[11px] text-muted-foreground p-2">Nenhum tópico.</div>}
              {topicos.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setAtivo(t.id)}
                  className={`text-left text-[11px] px-2 py-1 border truncate ${
                    t.id === ativo ? "border-accent text-accent bg-accent/10" : "border-border text-foreground"
                  }`}
                >
                  {t.titulo || "(sem título)"}
                </button>
              ))}
              {canEdit && (
                <button type="button" onClick={adicionar} className="retro-btn text-[11px] mt-1">
                  + Novo tópico
                </button>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              {atual ? (
                <>
                  <div className="flex gap-2">
                    <input
                      className="retro-input flex-1 text-sm font-bold"
                      value={atual.titulo}
                      disabled={!canEdit}
                      onChange={(e) => update(topicos.map((t) => (t.id === atual.id ? { ...t, titulo: e.target.value } : t)))}
                    />
                    {canEdit && (
                      <button type="button" onClick={() => remover(atual.id)} className="retro-btn text-[11px] text-destructive">
                        🗑️
                      </button>
                    )}
                  </div>
                  <textarea
                    className="retro-input flex-1 min-h-[300px] text-[12px] resize-none"
                    value={atual.texto}
                    disabled={!canEdit}
                    placeholder="Escreva aqui..."
                    onChange={(e) => update(topicos.map((t) => (t.id === atual.id ? { ...t, texto: e.target.value } : t)))}
                  />
                </>
              ) : (
                <div className="text-[12px] text-muted-foreground p-4">Crie um tópico para começar a escrever.</div>
              )}
            </div>
          </div>
          {canEdit && (
            <div className="flex justify-end">
              <button type="button" onClick={salvar} disabled={saving || !dirty} className="retro-btn text-[11px] px-3">
                {saving ? "Salvando..." : dirty ? "💾 Salvar" : "✔ Salvo"}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlocoNotas;
