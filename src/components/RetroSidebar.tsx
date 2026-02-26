import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface RetroSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    title: "Fichas",
    items: [
      { id: "fichas", label: "📜 Ver Fichas" },
      { id: "criar", label: "✏️ Criar Ficha" },
      { id: "criar-jutsu", label: "🌀 Criar Jutsu" },
    ],
  },
  {
    title: "Info",
    items: [
      { id: "sobre", label: "📖 Sobre" },
    ],
  },
];

const RetroSidebar = ({ activeTab, onTabChange }: RetroSidebarProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    if (isMobile) setOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setOpen(!open)}
          className="fixed top-2 left-2 z-50 retro-button text-xs px-2 py-1"
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>

        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/70"
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          className={`fixed top-0 left-0 z-40 h-full w-[200px] bg-background border-r border-border transform transition-transform duration-200 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ paddingTop: "48px" }}
        >
          {menuItems.map((group) => (
            <div key={group.title} className="mb-3">
              <div className="retro-sidebar-header px-3 py-1 text-xs text-center text-primary-foreground uppercase tracking-wider">
                {group.title}
              </div>
              <div className="retro-panel">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`block w-full text-left px-3 py-2 text-xs transition-colors ${
                      activeTab === item.id
                        ? "bg-muted text-accent"
                        : "text-foreground hover:bg-muted hover:text-accent"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>
      </>
    );
  }

  return (
    <aside className="w-[180px] shrink-0">
      {menuItems.map((group) => (
        <div key={group.title} className="mb-3">
          <div className="retro-sidebar-header px-3 py-1 text-xs text-center text-primary-foreground uppercase tracking-wider">
            {group.title}
          </div>
          <div className="retro-panel">
            {group.items.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`block w-full text-left px-3 py-2 text-xs transition-colors ${
                  activeTab === item.id
                    ? "bg-muted text-accent"
                    : "text-foreground hover:bg-muted hover:text-accent"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
};

export default RetroSidebar;
