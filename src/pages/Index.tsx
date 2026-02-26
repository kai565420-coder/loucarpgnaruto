import { useState } from "react";
import RetroHeader from "@/components/RetroHeader";
import RetroSidebar from "@/components/RetroSidebar";
import RetroFooter from "@/components/RetroFooter";
import CharacterList from "@/components/CharacterList";
import CharacterForm from "@/components/CharacterForm";
import { useUserIp } from "@/hooks/useUserIp";

const Index = () => {
  const { ip, loading } = useUserIp();
  const [activeTab, setActiveTab] = useState("fichas");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = () => {
    setRefreshKey((k) => k + 1);
    setActiveTab("fichas");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <RetroHeader />

      {/* Status bar */}
      <div className="bg-card border-b border-border px-4 py-1 text-[10px] text-muted-foreground flex justify-between max-w-[1000px] mx-auto w-full">
        <span>IP: {loading ? "..." : ip}</span>
        <span>Sistema de Fichas v1.0</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex max-w-[1000px] mx-auto w-full py-3 px-2 gap-3">
        <RetroSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="retro-panel p-4 text-center text-muted-foreground text-xs">
              Conectando ao servidor...
            </div>
          ) : activeTab === "fichas" ? (
            <CharacterList ip={ip || "unknown"} refreshKey={refreshKey} />
          ) : activeTab === "criar" ? (
            <CharacterForm ip={ip || "unknown"} onCreated={handleCreated} />
          ) : activeTab === "sobre" ? (
            <div className="retro-panel p-4">
              <div className="retro-section-title">📖 Sobre o Sistema</div>
              <p className="text-xs text-foreground leading-relaxed">
                Sistema de fichas para RPG de Naruto. Cada jogador pode criar fichas de personagem
                com atributos, perícias e imagem. O sistema identifica jogadores pelo IP,
                então não é necessário criar conta.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Personagens e universo © Masashi Kishimoto
              </p>
            </div>
          ) : null}
        </main>
      </div>

      <RetroFooter />
    </div>
  );
};

export default Index;
