import { useState } from "react";
import RetroHeader from "@/components/RetroHeader";
import RetroSidebar from "@/components/RetroSidebar";
import RetroFooter from "@/components/RetroFooter";
import CharacterList from "@/components/CharacterList";
import CharacterForm from "@/components/CharacterForm";
import JutsuForm from "@/components/JutsuForm";
import ItemList from "@/components/ItemList";
import PersonalizadoList from "@/components/PersonalizadoList";
import JutsuWindow from "@/components/JutsuWindow";
import ItemWindow from "@/components/ItemWindow";
import { useUserIp } from "@/hooks/useUserIp";
import { useAdmin } from "@/contexts/AdminContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface Jutsu {
  id: string;
  nome: string;
  informacoes: string;
  imagem_url: string | null;
}

interface Item {
  id: string;
  nome: string;
  descricao: string;
  valor: string;
  imagem_url: string | null;
}

type WindowEntry =
  | { type: "jutsu"; id: string; data: Jutsu; position: { x: number; y: number } }
  | { type: "item"; id: string; data: Item; position: { x: number; y: number } };

type MinimizedEntry =
  | { type: "jutsu"; id: string; data: Jutsu }
  | { type: "item"; id: string; data: Item };

const Index = () => {
  const { ip, loading } = useUserIp();
  const isMobile = useIsMobile();
  const { isAdminMode } = useAdmin();
  const [activeTab, setActiveTab] = useState("fichas");
  const [refreshKey, setRefreshKey] = useState(0);
  const [openWindows, setOpenWindows] = useState<WindowEntry[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<MinimizedEntry[]>([]);

  const handleCreated = () => {
    setRefreshKey((k) => k + 1);
    setActiveTab("fichas");
  };

  const openWindow = (type: "jutsu" | "item", id: string, data: any) => {
    setMinimizedWindows((prev) => prev.filter((m) => m.id !== id));
    setOpenWindows((prev) => {
      if (prev.some((w) => w.id === id)) return prev;
      const offset = prev.length * 30;
      return [...prev, { type, id, data, position: { x: 150 + offset, y: 100 + offset } }];
    });
  };

  const closeWindow = (id: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
    setMinimizedWindows((prev) => prev.filter((m) => m.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setOpenWindows((prev) => {
      const found = prev.find((w) => w.id === id);
      if (found) {
        setMinimizedWindows((mp) => [
          ...mp.filter((m) => m.id !== id),
          { type: found.type, id: found.id, data: found.data } as MinimizedEntry,
        ]);
      }
      return prev.filter((w) => w.id !== id);
    });
  };

  const restoreWindow = (id: string) => {
    setMinimizedWindows((prev) => {
      const found = prev.find((m) => m.id === id);
      if (found) {
        setOpenWindows((op) => {
          if (op.some((w) => w.id === id)) return op;
          const offset = op.length * 30;
          return [...op, { ...found, position: { x: 150 + offset, y: 100 + offset } } as WindowEntry];
        });
      }
      return prev.filter((m) => m.id !== id);
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div
        className="fixed inset-0 z-0 bg-center bg-no-repeat bg-cover opacity-10 pointer-events-none"
        style={{ backgroundImage: "url('/images/naruto-bg.png')" }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <RetroHeader />

        <div className="bg-card border-b border-border px-4 py-1 text-[10px] text-muted-foreground flex justify-end max-w-[1000px] mx-auto w-full">
          <span>Sistema de Fichas v1.0</span>
        </div>

        <div className="flex-1 flex max-w-[1000px] mx-auto w-full py-3 px-2 gap-3">
          <RetroSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="retro-panel p-4 text-center text-muted-foreground text-xs">
                Conectando ao servidor...
              </div>
            ) : activeTab === "fichas" ? (
              <CharacterList
                ip={ip || "unknown"}
                refreshKey={refreshKey}
                onOpenJutsu={(jutsu) => openWindow("jutsu", jutsu.id, jutsu)}
              />
            ) : activeTab === "criar" ? (
              <CharacterForm ip={ip || "unknown"} onCreated={handleCreated} />
            ) : activeTab === "criar-jutsu" && isAdminMode ? (
              <JutsuForm ip={ip || "unknown"} onCreated={() => setActiveTab("fichas")} />
            ) : activeTab === "itens" ? (
              <ItemList
                ip={ip || "unknown"}
                onOpenItem={(item) => openWindow("item", item.id, item)}
              />
            ) : activeTab === "personalizados" && isAdminMode ? (
              <PersonalizadoList
                ip={ip || "unknown"}
                onOpenItem={(item) => openWindow("item", item.id, item)}
              />
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

      {/* Global floating windows */}
      {openWindows.map((w) =>
        w.type === "jutsu" ? (
          <JutsuWindow
            key={w.id}
            jutsu={w.data as Jutsu}
            initialPosition={w.position}
            onClose={() => closeWindow(w.id)}
            onMinimize={() => minimizeWindow(w.id)}
          />
        ) : (
          <ItemWindow
            key={w.id}
            item={w.data as Item}
            initialPosition={w.position}
            admin={isAdminMode}
            onClose={() => closeWindow(w.id)}
            onMinimize={() => minimizeWindow(w.id)}
          />
        )
      )}

      {/* Global minimized taskbar */}
      {minimizedWindows.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-1 p-1 bg-card border-t border-border">
          {minimizedWindows.map((m) => (
            <div key={m.id} className="flex items-center gap-0.5">
              <button
                className="text-[10px] px-2 py-1 bg-muted border border-border hover:border-accent truncate max-w-[150px]"
                onClick={() => restoreWindow(m.id)}
              >
                {m.type === "jutsu" ? "🌀" : "🎒"} {m.data.nome}
              </button>
              <button
                className="text-[10px] px-1 py-1 bg-muted border border-border hover:border-destructive text-muted-foreground hover:text-destructive"
                onClick={() => closeWindow(m.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
