import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface JutsuFormProps {
  ip: string;
  onCreated: () => void;
}

interface Jutsu {
  id: string;
  nome: string;
  informacoes: string;
  imagem_url: string | null;
  created_at: string;
}

const JutsuForm = ({ ip, onCreated }: JutsuFormProps) => {
  const [nome, setNome] = useState("");
  const [informacoes, setInformacoes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [jutsus, setJutsus] = useState<Jutsu[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchJutsus = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("jutsus")
      .select("*")
      .order("created_at", { ascending: false });
    setJutsus(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchJutsus();
  }, [fetchJutsus]);

  const handleBold = () => {
    const textarea = document.getElementById("jutsu-info-textarea") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = informacoes.substring(start, end);
    const before = informacoes.substring(0, start);
    const after = informacoes.substring(end);
    if (selected) {
      setInformacoes(`${before}**${selected}**${after}`);
    } else {
      setInformacoes(`${before}****${after}`);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        textarea.focus();
      }, 0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta habilidade?")) return;
    const { error } = await supabase.from("jutsus").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao deletar: " + error.message);
    } else {
      toast.success("Habilidade deletada!");
      fetchJutsus();
    }
  };

  const startEdit = (jutsu: Jutsu) => {
    setEditingId(jutsu.id);
    setNome(jutsu.nome);
    setInformacoes(jutsu.informacoes);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNome("");
    setInformacoes("");
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("Nome é obrigatório!");
      return;
    }

    setSaving(true);
    try {
      let imagem_url = "";

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `jutsu_${ip.replace(/\./g, "_")}_${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("character-images")
          .upload(path, imageFile);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("character-images")
          .getPublicUrl(path);
        imagem_url = urlData.publicUrl;
      }

      if (editingId) {
        const updateData: Record<string, any> = { nome, informacoes };
        if (imagem_url) updateData.imagem_url = imagem_url;
        const { error } = await supabase.from("jutsus").update(updateData).eq("id", editingId);
        if (error) throw error;
        toast.success("Habilidade atualizada!");
        setEditingId(null);
      } else {
        const { error } = await supabase.from("jutsus").insert({
          nome,
          informacoes,
          imagem_url,
          ip_address: ip,
        });
        if (error) throw error;
        toast.success("Habilidade criada com sucesso!");
      }

      setNome("");
      setInformacoes("");
      setImageFile(null);
      fetchJutsus();
      onCreated();
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-accent text-sm">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="retro-section-title">
          {editingId ? "✏️ Editar Habilidade" : "🌀 Criar Nova Habilidade"}
        </div>

        <div className="retro-panel p-3 mb-3">
          <div className="mb-3">
            <label className="retro-label block mb-1">Nome:</label>
            <input
              type="text"
              className="retro-input w-full"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do Jutsu ou Habilidade"
            />
          </div>

          <div className="mb-3">
            <label className="retro-label block mb-1">Informações:</label>
            <div className="flex gap-1 mb-1">
              <button
                type="button"
                onClick={handleBold}
                className="retro-button text-[10px] px-2 py-0.5 font-bold"
                title="Negrito (selecione o texto primeiro)"
              >
                B
              </button>
              <span className="text-[9px] text-muted-foreground self-center ml-1">
                Selecione o texto e clique em B para negrito
              </span>
            </div>
            <textarea
              id="jutsu-info-textarea"
              className="retro-input w-full text-xs min-h-[200px]"
              value={informacoes}
              onChange={(e) => setInformacoes(e.target.value)}
              placeholder="Descreva o jutsu ou habilidade em detalhes... Use **texto** para negrito."
            />
          </div>

          <div>
            <label className="retro-label block mb-1">Imagem:</label>
            <input
              type="file"
              accept="image/*"
              className="retro-input w-full text-xs"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {editingId && (
            <button type="button" onClick={cancelEdit} className="retro-button flex-1 py-2">
              ❌ Cancelar Edição
            </button>
          )}
          <button type="submit" className="retro-button flex-1 py-2" disabled={saving}>
            {saving ? "Salvando..." : editingId ? "💾 Atualizar Habilidade" : "💾 Salvar Habilidade"}
          </button>
        </div>
      </form>

      {/* Lista de jutsus existentes */}
      <div className="mt-6">
        <div className="retro-section-title">📋 Habilidades Cadastradas</div>
        <div className="retro-panel p-2">
          {loading ? (
            <p className="text-muted-foreground text-[11px] text-center py-2">Carregando...</p>
          ) : jutsus.length === 0 ? (
            <p className="text-muted-foreground text-[11px] text-center py-2">Nenhuma habilidade cadastrada ainda.</p>
          ) : (
            jutsus.map((jutsu) => (
              <div key={jutsu.id} className="border-b border-border last:border-0 py-2 px-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-accent font-bold">🌀 {jutsu.nome}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(jutsu)}
                      className="text-[10px] text-muted-foreground hover:text-accent"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(jutsu.id)}
                      className="text-[10px] text-muted-foreground hover:text-destructive"
                      title="Deletar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {jutsu.informacoes && (
                  <div className="text-[11px] text-foreground mt-1 whitespace-pre-wrap leading-relaxed line-clamp-3">
                    {renderBoldText(jutsu.informacoes)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JutsuForm;
