import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface JutsuFormProps {
  ip: string;
  onCreated: () => void;
}

const JutsuForm = ({ ip, onCreated }: JutsuFormProps) => {
  const [nome, setNome] = useState("");
  const [informacoes, setInformacoes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

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

      const { error } = await supabase.from("jutsus").insert({
        nome,
        informacoes,
        imagem_url,
        ip_address: ip,
      });

      if (error) throw error;

      toast.success("Jutsu criado com sucesso!");
      setNome("");
      setInformacoes("");
      setImageFile(null);
      onCreated();
    } catch (err: any) {
      toast.error("Erro ao criar jutsu: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="retro-section-title">🌀 Criar Novo Jutsu</div>

      <div className="retro-panel p-3 mb-3">
        <div className="mb-3">
          <label className="retro-label block mb-1">Nome:</label>
          <input
            type="text"
            className="retro-input w-full"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do Jutsu"
          />
        </div>

        <div className="mb-3">
          <label className="retro-label block mb-1">Informações:</label>
          <textarea
            className="retro-input w-full text-xs min-h-[200px]"
            value={informacoes}
            onChange={(e) => setInformacoes(e.target.value)}
            placeholder="Descreva o jutsu em detalhes..."
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

      <button type="submit" className="retro-button w-full py-2" disabled={saving}>
        {saving ? "Salvando..." : "💾 Salvar Jutsu"}
      </button>
    </form>
  );
};

export default JutsuForm;
