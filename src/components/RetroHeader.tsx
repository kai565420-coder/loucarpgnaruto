const RetroHeader = () => {
  return (
    <header className="retro-header-bar px-4 py-2">
      <div className="max-w-[1000px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-primary-foreground tracking-wider">
            E a Louça RPG
          </span>
        </div>
        <div className="text-xs text-primary-foreground opacity-80">
          Sistema de Fichas de Personagem
        </div>
      </div>
    </header>
  );
};

export default RetroHeader;
