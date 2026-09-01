import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import CharacterSheet from "./CharacterSheet";
import { toast } from "sonner";
import { useAdmin } from "@/contexts/AdminContext";

interface Jutsu {
  id: string;
  nome: string;
  informacoes: string;
  imagem_url: string | null;
}

interface OpenItem {
  id: string;
  nome: string;
  descricao: string;
  valor: string;
  peso?: number;
  imagem_url: string | null;
}

interface CharacterListProps {
  ip: string;
  refreshKey: number;
  archived?: boolean;
  onOpenJutsu?: (jutsu: Jutsu, tatica?: { personagem: string; maestria: string; selosManuais: string; taijutsu?: number; controleChakra?: number }) => void;
  onOpenItem?: (item: OpenItem) => void;
}

const CharacterList = ({ ip, refreshKey, archived = false, onOpenJutsu, onOpenItem }: CharacterListProps) => {
  const { isAdminMode } = useAdmin();
  const [sheets, setSheets] = useState<Tables<"character_sheets">[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSheets = async (silent = false) => {
    if (!silent) setLoading(true);
    const { data, error } = await supabase
      .from("character_sheets")
      .select("*")
      .eq("arquivada", archived)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar fichas");
    } else {
      setSheets(data || []);
    }
    if (!silent) setLoading(false);
  };

  useEffect(() => {
    fetchSheets(refreshKey > 0);
  }, [refreshKey, archived]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta ficha?")) return;
    const { error } = await supabase.from("character_sheets").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao deletar");
    } else {
      toast.success("Ficha deletada");
      fetchSheets();
    }
  };

  const handleArchive = async (id: string, arquivada: boolean) => {
    const { error } = await supabase.from("character_sheets").update({ arquivada: !arquivada }).eq("id", id);
    if (error) {
      toast.error("Erro ao arquivar");
    } else {
      toast.success(arquivada ? "Ficha desarquivada" : "Ficha arquivada");
      fetchSheets();
    }
  };

  if (loading) {
    return <div className="text-muted-foreground text-xs">Carregando fichas...</div>;
  }

  if (sheets.length === 0) {
    return (
      <div className="retro-panel p-4 text-center">
        <p className="text-muted-foreground text-xs">
          {archived ? "Nenhuma ficha arquivada." : "Nenhuma ficha encontrada."}
        </p>
        {!archived && <p className="text-muted-foreground text-[11px] mt-1">Crie uma ficha no menu lateral!</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="retro-section-title">
        {archived ? `📦 Fichas Arquivadas (${sheets.length})` : `📜 Fichas de Personagens (${sheets.length})`}
      </div>
      {[...sheets].sort((a, b) => a.nome.localeCompare(b.nome)).map((sheet) => (
        <CharacterSheet
          key={sheet.id}
          sheet={sheet}
          isOwner={isAdminMode}
          onDelete={() => handleDelete(sheet.id)}
          onArchive={() => handleArchive(sheet.id, sheet.arquivada)}
          onUpdated={fetchSheets}
          onOpenJutsu={onOpenJutsu}
          onOpenItem={onOpenItem}
        />
      ))}
    </div>
  );
};


export default CharacterList;
