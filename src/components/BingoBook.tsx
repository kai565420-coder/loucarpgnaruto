import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";

interface BingoEntry {
  id: string;
  nome: string;
  alcunha: string;
  imagem_url: string | null;
  vila_origem: string;
  vila_registro: string;
  afiliacao_atual: string;
  rank_ameaca: string;
  recompensa: string;
  instrucoes_captura: string;
  crimes_conhecidos: string;
  ultima_localizacao: string;
  tecnicas_conhecidas: string;
  afinidades_elementais: string;
  kekkei_genkai: string;
  invocacoes: string;
  estilo_combate: string;
  pontos_fortes: string;
  pontos_fracos: string;
  nivel_sigilo: string;
  situacao: string;
}

const FIELDS: { key: keyof BingoEntry; label: string; long?: boolean }[] = [
  { key: "nome", label: "Nome" },
  { key: "alcunha", label: "Alcunha" },
  { key: "vila_origem", label: "Vila de Origem" },
  { key: "vila_registro", label: "Registrado por qual vila" },
  { key: "afiliacao_atual", label: "Afiliação Atual" },
  { key: "rank_ameaca", label: "Rank de Ameaça" },
  { key: "recompensa", label: "Recompensa Oferecida" },
  { key: "instrucoes_captura", label: "Instruções de Captura", long: true },
  { key: "crimes_conhecidos", label: "Crimes Conhecidos", long: true },
  { key: "ultima_localizacao", label: "Última Localização" },
  { key: "tecnicas_conhecidas", label: "Técnicas Conhecidas", long: true },
  { key: "afinidades_elementais", label: "Afinidades Elementais" },
  { key: "kekkei_genkai", label: "Kekkei Genkai" },
  { key: "invocacoes", label: "Invocações" },
  { key: "estilo_combate", label: "Estilo de Combate" },
  { key: "pontos_fortes", label: "Pontos Fortes conhecidos", long: true },
  { key: "pontos_fracos", label: "Pontos Fracos conhecidos", long: true },
  { key: "nivel_sigilo", label: "Nível de Sigilo" },
];

const emptyForm = (): Partial<BingoEntry> => ({
  nome: "", alcunha: "", imagem_url: "", vila_origem: "", vila_registro: "",
  afiliacao_atual: "", rank_ameaca: "", recompensa: "", instrucoes_captura: "",
  crimes_conhecidos: "", ultima_localizacao: "", tecnicas_conhecidas: "",
  afinidades_elementais: "", kekkei_genkai: "", invocacoes: "", estilo_combate: "",
  pontos_fortes: "", pontos_fracos: "", nivel_sigilo: "", situacao: "ativo",
});

const pageStyle: React.CSSProperties = {
  background:
    "linear-gradient(135deg, hsl(43 55% 84%) 0%, hsl(40 45% 76%) 55%, hsl(36 40% 68%) 100%)",
  boxShadow: "inset 0 0 40px hsl(32 45% 45% / 0.45)",
  color: "hsl(30 35% 22%)",
};

const CapturedMark = ({ label }: { label: string }) => (
  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-75">
      <defs>
        <filter id="bingo-brush">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter="url(#bingo-brush)" fill="none" stroke="hsl(0 72% 34%)" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10,7 C24,26 38,41 52,54 C63,66 76,80 90,95" strokeWidth="7.5" opacity="0.9" />
        <path d="M11,10 C27,27 40,44 55,57 C66,68 78,82 88,92" strokeWidth="3" opacity="0.55" />
        <path d="M91,6 C77,24 64,40 49,53 C37,64 22,79 9,94" strokeWidth="8.5" opacity="0.9" />
        <path d="M89,10 C74,27 62,43 47,56 C35,67 21,81 11,91" strokeWidth="2.6" opacity="0.5" />
      </g>
    </svg>
    <span
      className="relative text-[hsl(0_75%_35%)] font-bold uppercase tracking-widest text-lg md:text-2xl border-4 border-[hsl(0_75%_35%)] px-4 py-1 -rotate-[14deg]"
      style={{ background: "hsl(0 0% 100% / 0.25)" }}
    >
      {label}
    </span>
  </div>
);


const BingoBook = () => {
  const { isAdminMode } = useAdmin();
  const [entries, setEntries] = useState<BingoEntry[]>([]);
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState<"next" | "prev" | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<BingoEntry>>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchEntries = useCallback(async () => {
    const { data } = await (supabase as any)
      .from("bingo_entries")
      .select("*")
      .order("nome");
    setEntries((data || []) as BingoEntry[]);
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const totalPages = Math.max(1, entries.length);
  const current = entries[page];

  useEffect(() => {
    if (page > totalPages - 1) setPage(totalPages - 1);
  }, [page, totalPages]);

  const go = (dir: "next" | "prev") => {
    if (flipping) return;
    if (dir === "next" && page >= totalPages - 1) return;
    if (dir === "prev" && page <= 0) return;
    setFlipping(dir);
    if (dir === "prev") setPage((p) => p - 1);
    window.setTimeout(() => {
      if (dir === "next") setPage((p) => p + 1);
      setFlipping(null);
    }, 550);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go("next"); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go("prev"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const uploadFoto = async (file: File) => {
    setUploading(true);
    const path = `bingo/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("character-images").upload(path, file);
    if (error) { toast.error("Erro ao enviar imagem"); setUploading(false); return; }
    const { data } = supabase.storage.from("character-images").getPublicUrl(path);
    setForm((f) => ({ ...f, imagem_url: data.publicUrl }));
    setUploading(false);
  };

  const save = async () => {
    if (!form.nome?.trim()) { toast.error("Informe o nome do ninja"); return; }
    if (editingId) {
      const { error } = await (supabase as any).from("bingo_entries").update(form).eq("id", editingId);
      if (error) { toast.error("Erro ao salvar"); return; }
      toast.success("Registro atualizado");
    } else {
      const { error } = await (supabase as any).from("bingo_entries").insert(form);
      if (error) { toast.error("Erro ao registrar"); return; }
      toast.success("Ninja registrado no Livro Bingo");
    }
    setShowForm(false); setEditingId(null); setForm(emptyForm());
    fetchEntries();
  };

  const removeEntry = async (id: string) => {
    await (supabase as any).from("bingo_entries").delete().eq("id", id);
    toast.success("Registro removido");
    fetchEntries();
  };

  const setSituacao = async (id: string, situacao: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, situacao } : e)));
    await (supabase as any).from("bingo_entries").update({ situacao }).eq("id", id);
  };

  const startEdit = (e: BingoEntry) => {
    setForm({ ...e }); setEditingId(e.id); setShowForm(true);
  };

  const field = (key: keyof BingoEntry, label: string, long?: boolean) => (
    <div key={key} className={long ? "col-span-2" : ""}>
      <label className="block text-[10px] uppercase tracking-wide mb-0.5">{label}</label>
      {long ? (
        <textarea
          className="retro-input w-full text-xs min-h-[60px]"
          value={(form[key] as string) || ""}
          onChange={(ev) => setForm((f) => ({ ...f, [key]: ev.target.value }))}
        />
      ) : (
        <input
          className="retro-input w-full text-xs"
          value={(form[key] as string) || ""}
          onChange={(ev) => setForm((f) => ({ ...f, [key]: ev.target.value }))}
        />
      )}
    </div>
  );

  const renderPage = (entry: BingoEntry | undefined, num: number) => (
    <div className="absolute inset-0 p-5 flex flex-col md:overflow-y-auto overflow-hidden" style={pageStyle}>
      <div className="text-[11px] uppercase tracking-widest opacity-70">Livro Bingo</div>
      {!entry ? (
        <div className="flex-1 flex items-center justify-center text-xs opacity-60">
          Nenhum ninja registrado.
        </div>
      ) : (
        <div className="flex-1 mt-2 flex flex-col">
          <div className="flex gap-4">
            <div className="w-[46%] aspect-[3/4] border-[3px] border-[hsl(30_35%_30%)] shrink-0 overflow-hidden flex items-center justify-center">
              {entry.imagem_url ? (
                <img src={entry.imagem_url} alt={`Fotografia de ${entry.nome}`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] opacity-60">Sem foto</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xl md:text-2xl font-bold leading-tight break-words">{entry.nome}</div>
              {entry.alcunha && <div className="text-xs md:sm italic">"{entry.alcunha}"</div>}
              <div className="text-[10px] md:text-sm mt-1 md:mt-2">Rank: <b>{entry.rank_ameaca || "—"}</b></div>
              <div className="text-[10px] md:text-sm">Recompensa: <b>{entry.recompensa || "—"}</b></div>
              <div className="text-[10px] md:text-sm">Sigilo: <b>{entry.nivel_sigilo || "—"}</b></div>
              <div className="text-[10px] md:text-sm">Origem: <b>{entry.vila_origem || "—"}</b></div>
              <div className="text-[10px] md:text-sm">Afiliação: <b>{entry.afiliacao_atual || "—"}</b></div>
              <div className="text-[10px] md:text-sm">Local: <b>{entry.ultima_localizacao || "—"}</b></div>
            </div>
          </div>

          <div className="mt-2 md:mt-4 grid grid-cols-2 gap-x-2 md:gap-x-4 gap-y-0.5 md:gap-y-1.5 flex-1 content-start overflow-hidden">
            {FIELDS.filter((f) => !["nome", "alcunha", "rank_ameaca", "recompensa", "nivel_sigilo", "vila_origem", "afiliacao_atual", "ultima_localizacao"].includes(f.key as string)).map((f) => (
              <div key={f.key} className={`text-[9px] md:text-[12px] leading-tight md:leading-snug ${f.long ? "col-span-2" : ""}`}>
                <span className="uppercase tracking-wide opacity-70 font-bold">{f.label}: </span>
                <span className="whitespace-pre-wrap">{(entry[f.key] as string) || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="text-center text-[11px] opacity-70 mt-2">
        Página {Math.min(num + 1, totalPages)} / {totalPages}
      </div>
    </div>
  );

  const basePage = flipping ? Math.min(page + 1, totalPages - 1) : page;
  const baseEntry = entries[basePage];


  return (
    <div className="retro-panel p-4">
      <div className="retro-section-title">Livro Bingo</div>

      {isAdminMode && (
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            className="retro-button text-xs"
            onClick={() => {
              setShowForm((s) => !s);
              if (!showForm) { setForm(emptyForm()); setEditingId(null); }
            }}
          >
            {showForm ? "✕ Cancelar" : "➕ Registrar Ninja"}
          </button>
          {current && !showForm && (
            <>
              <button className="retro-button text-xs" onClick={() => startEdit(current)}>✏️ Editar</button>
              <button className="retro-button text-xs" onClick={() => removeEntry(current.id)}>🗑️ Excluir</button>
              <select
                className="retro-input text-xs"
                value={current.situacao}
                onChange={(e) => setSituacao(current.id, e.target.value)}
              >
                <option value="ativo">Em Atividade</option>
                <option value="capturado">✗ Capturado</option>
                <option value="morto">✗ Morto</option>
              </select>
            </>
          )}
        </div>
      )}

      {showForm && isAdminMode && (
        <div className="retro-panel p-3 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="block text-[10px] uppercase tracking-wide mb-0.5">Fotografia / Desenho</label>
              <div className="flex items-center gap-2">
                {form.imagem_url ? (
                  <img src={form.imagem_url} alt="Prévia da fotografia do ninja" className="w-16 h-16 object-cover border border-border" />
                ) : null}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="text-[10px]"
                  onChange={(e) => e.target.files?.[0] && uploadFoto(e.target.files[0])}
                />
                {uploading && <span className="text-[10px] text-muted-foreground">Enviando...</span>}
              </div>
            </div>
            {FIELDS.map((f) => field(f.key, f.label, f.long))}
          </div>
          <button className="retro-button text-xs mt-3" onClick={save}>
            {editingId ? "💾 Salvar Alterações" : "📕 Registrar no Livro"}
          </button>
        </div>
      )}

      <div className="relative mx-auto w-full max-w-[760px]" style={{ perspective: "1600px" }}>
        <div
          className="relative w-full aspect-[4/5] md:aspect-[3/4] border border-border overflow-hidden"
          style={{ transformStyle: "preserve-3d", ...pageStyle }}
        >
          <div className="absolute inset-0" style={pageStyle}>
            {renderPage(baseEntry, basePage)}
          </div>

          {baseEntry && baseEntry.situacao !== "ativo" && (
            <CapturedMark label={baseEntry.situacao === "morto" ? "Morto" : "Capturado"} />
          )}

          {flipping && (
            <div
              key={`${page}-${flipping}`}
              className="absolute inset-0 overflow-hidden"
              style={{
                ...pageStyle,
                transformOrigin: "left center",
                animation: `${flipping === "next" ? "bingo-flip-next" : "bingo-flip-prev"} 0.55s ease-in-out forwards`,
                backfaceVisibility: "hidden",
              }}
            >
              {renderPage(current, page)}
              {current && current.situacao !== "ativo" && (
                <CapturedMark label={current.situacao === "morto" ? "Morto" : "Capturado"} />
              )}
            </div>
          )}
        </div>


        <style>{`
          @keyframes bingo-flip-next {
            from { transform: rotateY(0deg); filter: brightness(1); }
            to { transform: rotateY(-175deg); filter: brightness(0.7); }
          }
          @keyframes bingo-flip-prev {
            from { transform: rotateY(-175deg); filter: brightness(0.7); }
            to { transform: rotateY(0deg); filter: brightness(1); }
          }
        `}</style>
      </div>

      <div className="flex items-center justify-center gap-3 mt-4">
        <button className="retro-button text-xs disabled:opacity-40" onClick={() => go("prev")} disabled={page === 0 || !!flipping}>
          ◀ Anterior
        </button>
        <span className="text-xs text-muted-foreground">{Math.min(page + 1, totalPages)} / {totalPages}</span>
        <button className="retro-button text-xs disabled:opacity-40" onClick={() => go("next")} disabled={page >= totalPages - 1 || !!flipping}>
          Próxima ▶
        </button>
      </div>
    </div>
  );
};

export default BingoBook;
