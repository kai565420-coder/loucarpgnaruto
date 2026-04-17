import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface Personalizado {
  id: string;
  nome: string;
  descricao: string;
  valor: string;
  peso: number;
  imagem_url: string | null;
  created_at: string;
}

interface PersonalizadoListProps {
  ip: string;
  onOpenItem?: (item: Personalizado) => void;
}

const PersonalizadoList = ({ ip, onOpenItem }: PersonalizadoListProps) => {
  const { isAdminMode: admin } = useAdmin();
  const isMobile = useIsMobile();
  const [items, setItems] = useState<Personalizado[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [peso, setPeso] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("personalizados")
      .select("*")
      .order("created_at", { ascending: true });
    setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleBold = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = descricao.substring(start, end);
    const before = descricao.substring(0, start);
    const after = descricao.substring(end);
    if (selected) {
      setDescricao(`${before}**${selected}**${after}`);
    } else {
      setDescricao(`${before}****${after}`);
      setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + 2; textarea.focus(); }, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) { toast.error("Nome é obrigatório!"); return; }
    setSaving(true);
    try {
      let imagem_url = "";
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `pers_${ip.replace(/\./g, "_")}_${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("character-images").upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("character-images").getPublicUrl(path);
        imagem_url = urlData.publicUrl;
      }

      if (editingId) {
        const updateData: Record<string, any> = { nome, descricao, valor, peso };
        if (imagem_url) updateData.imagem_url = imagem_url;
        const { error } = await supabase.from("personalizados").update(updateData).eq("id", editingId);
        if (error) throw error;
        toast.success("Item personalizado atualizado!");
        setEditingId(null);
      } else {
        const { error } = await supabase.from("personalizados").insert({ nome, descricao, valor, peso, imagem_url, ip_address: ip });
        if (error) throw error;
        toast.success("Item personalizado criado!");
      }

      setNome(""); setDescricao(""); setValor(""); setPeso(0); setImageFile(null); setShowForm(false);
      fetchItems();
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este item?")) return;
    const { error } = await supabase.from("personalizados").delete().eq("id", id);
    if (error) { toast.error("Erro ao deletar: " + error.message); } else { toast.success("Item deletado!"); fetchItems(); }
  };

  const startEdit = (item: Personalizado) => {
    setEditingId(item.id); setNome(item.nome); setDescricao(item.descricao); setValor(item.valor); setPeso(item.peso || 0); setImageFile(null); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => { setEditingId(null); setNome(""); setDescricao(""); setValor(""); setPeso(0); setImageFile(null); setShowForm(false); };

  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="font-bold text-accent text-sm">{part.slice(2, -2)}</strong>;
      return <span key={i}>{part}</span>;
    });
  };

  const handleItemClick = (item: Personalizado) => {
    if (isMobile) { setExpandedId(expandedId === item.id ? null : item.id); }
    else { onOpenItem?.(item); }
  };

  const filtered = items.filter((i) => i.nome.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <div className="retro-section-title">⭐ Personalizados</div>

      {admin && !showForm && (
        <button onClick={() => setShowForm(true)} className="retro-button text-xs px-3 py-1 mb-3">➕ Criar Item Personalizado</button>
      )}

      {admin && showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="retro-panel p-3 mb-3">
            <div className="retro-section-title text-xs mb-2">{editingId ? "✏️ Editar" : "➕ Novo"} Item Personalizado</div>
            <div className="mb-3">
              <label className="retro-label block mb-1">Nome:</label>
              <input type="text" className="retro-input w-full" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do item" />
            </div>
            <div className="mb-3">
              <label className="retro-label block mb-1">Descrição:</label>
              <div className="flex gap-1 mb-1">
                <button type="button" onClick={handleBold} className="retro-button text-[10px] px-2 py-0.5 font-bold" title="Negrito">B</button>
                <span className="text-[9px] text-muted-foreground self-center ml-1">Selecione o texto e clique em B para negrito</span>
              </div>
              <textarea ref={textareaRef} className="retro-input w-full text-xs min-h-[120px]" value={descricao} onChange={(e) => setDescricao(e.target.value)}
                onKeyDown={(e) => { if (e.ctrlKey && e.key === "b") { e.preventDefault(); handleBold(); } }}
                placeholder="Descreva o item... Use **texto** para negrito." />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="retro-label block mb-1">Valor:</label>
                <input type="text" className="retro-input w-full" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ex: 500 ryō" />
              </div>
              <div>
                <label className="retro-label block mb-1">Peso:</label>
                <input type="number" className="retro-input w-full" value={peso} onChange={(e) => setPeso(parseFloat(e.target.value) || 0)} placeholder="Ex: 0.16" min={0} step="0.001" />
              </div>
            </div>
            <div>
              <label className="retro-label block mb-1">Imagem:</label>
              <input type="file" accept="image/*" className="retro-input w-full text-xs" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={cancelEdit} className="retro-button flex-1 py-2">❌ Cancelar</button>
            <button type="submit" className="retro-button flex-1 py-2" disabled={saving}>{saving ? "Salvando..." : editingId ? "💾 Atualizar" : "💾 Salvar"}</button>
          </div>
        </form>
      )}

      <div className="mb-2">
        <input type="text" className="retro-input w-full text-xs" placeholder="🔍 Buscar item personalizado..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {loading ? (
        <div className="retro-panel p-4 text-center text-muted-foreground text-xs">Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="retro-panel p-4 text-center text-muted-foreground text-xs">Nenhum item personalizado encontrado.</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {filtered.map((item) => (
            <div key={item.id} className={`retro-panel p-2 cursor-pointer hover:border-accent transition-colors ${isMobile && expandedId === item.id ? "col-span-2" : ""}`} onClick={() => handleItemClick(item)}>
              {item.imagem_url && (
                <div className="w-full aspect-square mb-2 overflow-hidden rounded border border-border">
                  <img src={item.imagem_url} alt={item.nome} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="text-xs font-bold text-accent text-center truncate">{item.nome}</div>
              {item.peso > 0 && <div className="text-[9px] text-muted-foreground text-center">⚖️ {item.peso}</div>}

              {admin && !isMobile && (
                <div className="flex gap-1 mt-1 justify-center" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => startEdit(item)} className="text-[9px] text-muted-foreground hover:text-accent">✏️</button>
                  <button onClick={() => handleDelete(item.id)} className="text-[9px] text-muted-foreground hover:text-destructive">🗑️</button>
                </div>
              )}

              {isMobile && expandedId === item.id && (
                <div className="mt-2 border-t border-border pt-2" onClick={(e) => e.stopPropagation()}>
                  {item.descricao && <p className="text-[11px] text-foreground whitespace-pre-wrap leading-relaxed mb-1">{renderBoldText(item.descricao)}</p>}
                  {item.valor && <div className="mb-1 mt-1"><span className="text-sm font-bold text-accent">両 {item.valor}</span></div>}
                  {admin && (
                    <div className="flex gap-2 mt-2 justify-end">
                      <button onClick={() => startEdit(item)} className="text-[10px] text-muted-foreground hover:text-accent">✏️ Editar</button>
                      <button onClick={() => handleDelete(item.id)} className="text-[10px] text-muted-foreground hover:text-destructive">🗑️ Deletar</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalizadoList;
