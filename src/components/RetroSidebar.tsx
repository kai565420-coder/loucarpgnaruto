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
