import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CharacterFormProps {
  ip: string;
  onCreated: () => void;
}

const defaultValues = {
  nome: "",
  idade: "",
  elementos: "",
  classe: "",
  talento: "",
  vida: 0, vida_max: 0, sanidade: 0, sanidade_max: 0, forca_fisica: 0, destreza: 0, chakra: 0, chakra_max: 0,
  taijutsu: 0, forca_bruta: 0, imobilizacao: 0,
  acrobacia: 0, furtividade: 0, shurikenjutsu: 0, kenjutsu: 0, reflexos_ninja: 0, iniciativa: 0,
  analise_combate: 0, estrategia_tatica: 0, conhecimento_shinobi: 0, conhecimento_clas: 0, fuinjutsu: 0, sabotagem: 0,
  genjutsu: 0, resistencia_genjutsu: 0, concentracao: 0, intimidacao: 0, vontade_ninja: 0,
  fortitude: 0, resistencia_fisica: 0, recuperacao: 0, tolerancia_dor: 0, sobrevivencia: 0,
  controle_chakra: 0, moldagem_elemental: 0, ninjutsu_medico: 0, sensorial: 0,
  maestria_fogo: "", maestria_vento: "", maestria_terra: "", maestria_agua: "", maestria_raio: "",
  inventario: "",
};

const atributos = [
  { key: "forca_fisica", label: "Força Física" },
  { key: "destreza", label: "Destreza" },
];

const barAtributos = [
  { key: "vida", maxKey: "vida_max", label: "Vida" },
  { key: "sanidade", maxKey: "sanidade_max", label: "Sanidade" },
  { key: "chakra", maxKey: "chakra_max", label: "Chakra" },
];

const maestrias = [
  { key: "maestria_fogo", label: "Fogo" },
  { key: "maestria_vento", label: "Vento" },
  { key: "maestria_terra", label: "Terra" },
  { key: "maestria_agua", label: "Água" },
  { key: "maestria_raio", label: "Raio" },
];

const pericias = [
  {
    grupo: "FOR",
    items: [
      { key: "taijutsu", label: "Taijutsu" },
      { key: "forca_bruta", label: "Força Bruta" },
      { key: "imobilizacao", label: "Imobilização" },
    ],
  },
  {
    grupo: "AGI",
    items: [
      { key: "acrobacia", label: "Acrobacia" },
      { key: "furtividade", label: "Furtividade" },
      { key: "shurikenjutsu", label: "Shurikenjutsu" },
      { key: "kenjutsu", label: "Kenjutsu" },
      { key: "reflexos_ninja", label: "Reflexos Ninja" },
      { key: "iniciativa", label: "Iniciativa" },
    ],
  },
  {
    grupo: "INT",
    items: [
      { key: "analise_combate", label: "Análise de Combate" },
      { key: "estrategia_tatica", label: "Estratégia Tática" },
      { key: "conhecimento_shinobi", label: "Conhecimento Shinobi" },
      { key: "conhecimento_clas", label: "Conhecimento de Clãs" },
      { key: "fuinjutsu", label: "Fūinjutsu" },
      { key: "sabotagem", label: "Sabotagem" },
    ],
  },
  {
    grupo: "MEN",
    items: [
      { key: "genjutsu", label: "Genjutsu" },
      { key: "resistencia_genjutsu", label: "Resistência a Genjutsu" },
      { key: "concentracao", label: "Concentração" },
      { key: "intimidacao", label: "Intimidação" },
      { key: "vontade_ninja", label: "Vontade Ninja" },
    ],
  },
  {
    grupo: "CON",
    items: [
      { key: "fortitude", label: "Fortitude" },
      { key: "resistencia_fisica", label: "Resistência Física" },
      { key: "recuperacao", label: "Recuperação" },
      { key: "tolerancia_dor", label: "Tolerância à Dor" },
      { key: "sobrevivencia", label: "Sobrevivência" },
    ],
  },
  {
    grupo: "CHA",
    items: [
      { key: "controle_chakra", label: "Controle de Chakra" },
      { key: "moldagem_elemental", label: "Moldagem Elemental" },
      { key: "ninjutsu_medico", label: "Ninjutsu Médico" },
      { key: "sensorial", label: "Sensorial" },
    ],
  },
];

const CharacterForm = ({ ip, onCreated }: CharacterFormProps) => {
  const [form, setForm] = useState(defaultValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleTextChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNumberChange = (key: string, value: string) => {
    const num = parseInt(value) || 0;
    setForm((prev) => ({ ...prev, [key]: num }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      toast.error("Nome é obrigatório!");
      return;
    }

    setSaving(true);
    try {
      let imagem_url = "";

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${ip.replace(/\./g, "_")}_${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("character-images")
          .upload(path, imageFile);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("character-images")
          .getPublicUrl(path);
        imagem_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("character_sheets").insert({
        ...form,
        ip_address: ip,
        imagem_url,
      });

      if (error) throw error;

      toast.success("Ficha criada com sucesso!");
      setForm(defaultValues);
      setImageFile(null);
      onCreated();
    } catch (err: any) {
      toast.error("Erro ao criar ficha: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="retro-section-title">✏️ Criar Nova Ficha</div>

      {/* Info básica */}
      <div className="retro-panel p-3 mb-3">
        <div className="retro-section-title text-sm">Informações Básicas</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: "nome", label: "Nome" },
            { key: "idade", label: "Idade" },
            { key: "elementos", label: "Elementos" },
            { key: "classe", label: "Classe" },
            { key: "talento", label: "Talento" },
          ].map(({ key, label }) => (
            <div key={key} className={key === "nome" ? "col-span-2" : ""}>
              <label className="retro-label block mb-1">{label}:</label>
              <input
                type="text"
                className="retro-input w-full"
                value={(form as any)[key]}
                onChange={(e) => handleTextChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="mt-3">
          <label className="retro-label block mb-1">Imagem do Personagem:</label>
          <input
            type="file"
            accept="image/*"
            className="retro-input w-full text-xs"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>
      </div>

      {/* Barras Vida/Sanidade/Chakra */}
      <div className="retro-panel p-3 mb-3">
        <div className="retro-section-title text-sm">Vida / Sanidade / Chakra</div>
        <div className="grid grid-cols-1 gap-2">
          {barAtributos.map(({ key, maxKey, label }) => (
            <div key={key} className="flex items-center gap-2">
              <label className="retro-label text-xs w-[100px] shrink-0">{label}:</label>
              <input
                type="number"
                className="retro-input w-16 text-center"
                value={(form as any)[key]}
                onChange={(e) => handleNumberChange(key, e.target.value)}
                placeholder="Atual"
              />
              <span className="text-muted-foreground text-xs">/</span>
              <input
                type="number"
                className="retro-input w-16 text-center"
                value={(form as any)[maxKey]}
                onChange={(e) => handleNumberChange(maxKey, e.target.value)}
                placeholder="Máx"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Atributos */}
      <div className="retro-panel p-3 mb-3">
        <div className="retro-section-title text-sm">Atributos</div>
        <div className="grid grid-cols-2 gap-2">
          {atributos.map(({ key, label }) => (
            <div key={key}>
              <label className="retro-label block mb-1">{label}:</label>
              <input
                type="number"
                className="retro-input w-full"
                value={(form as any)[key]}
                onChange={(e) => handleNumberChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Perícias */}
      <div className="retro-panel p-3 mb-3">
        <div className="retro-section-title text-sm">Perícias</div>
        {pericias.map(({ grupo, items }) => (
          <div key={grupo} className="mb-3">
            <div className="text-accent font-bold text-xs mb-1 border-b border-border pb-1">
              {grupo}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {items.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <label className="retro-label text-[11px] w-[160px] shrink-0">{label}:</label>
                  <input
                    type="number"
                    className="retro-input w-16 text-center"
                    value={(form as any)[key]}
                    onChange={(e) => handleNumberChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Maestria + Inventário */}
      <div className="retro-panel p-3 mb-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="retro-section-title text-sm">Maestria</div>
          {maestrias.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2 mb-1">
              <label className="retro-label text-[11px] w-[80px] shrink-0">{label}:</label>
              <input
                type="text"
                className="retro-input w-full text-xs"
                value={(form as any)[key]}
                onChange={(e) => handleTextChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div>
          <div className="retro-section-title text-sm">Inventário</div>
          <textarea
            className="retro-input w-full text-xs min-h-[100px]"
            placeholder="Escreva os itens do inventário..."
            value={form.inventario}
            onChange={(e) => handleTextChange("inventario", e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="retro-button w-full py-2" disabled={saving}>
        {saving ? "Salvando..." : "💾 Salvar Ficha"}
      </button>
    </form>
  );
};

export default CharacterForm;
