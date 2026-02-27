import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import CharacterSheet from "./CharacterSheet";
import { toast } from "sonner";

interface CharacterListProps {
  ip: string;
  refreshKey: number;
}

const CharacterList = ({ ip, refreshKey }: CharacterListProps) => {
  const [sheets, setSheets] = useState<Tables<"character_sheets">[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSheets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("character_sheets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar fichas");
    } else {
      setSheets(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSheets();
  }, [refreshKey]);

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

  if (loading) {
    return <div className="text-muted-foreground text-xs">Carregando fichas...</div>;
  }

  if (sheets.length === 0) {
    return (
      <div className="retro-panel p-4 text-center">
        <p className="text-muted-foreground text-xs">Nenhuma ficha encontrada.</p>
        <p className="text-muted-foreground text-[11px] mt-1">Crie uma ficha no menu lateral!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="retro-section-title">📜 Fichas de Personagens ({sheets.length})</div>
      {[...sheets].sort((a, b) => a.nome.localeCompare(b.nome)).map((sheet) => (
        <CharacterSheet
          key={sheet.id}
          sheet={sheet}
          isOwner={sheet.ip_address === ip}
          onDelete={() => handleDelete(sheet.id)}
          onUpdated={fetchSheets}
        />
      ))}
    </div>
  );
};

export default CharacterList;
