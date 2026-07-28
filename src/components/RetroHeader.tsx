import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";

const RetroHeader = () => {
  const { isAdminMode, loginAdmin, logoutAdmin } = useAdmin();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const success = await loginAdmin(password);
    if (success) {
      toast.success("Modo administrador ativado!");
      setShowPasswordDialog(false);
      setPassword("");
    } else {
      toast.error("Senha incorreta!");
    }
  };

  return (
    <>
      <header className="retro-header-bar px-4 py-2">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-primary-foreground tracking-wider">
              E a Louça RPG
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-primary-foreground opacity-80">
              Sistema de Fichas de Personagem
            </span>
            {isAdminMode ? (
              <button
                onClick={logoutAdmin}
                className="text-[10px] px-2 py-0.5 bg-accent/80 text-primary-foreground border border-accent rounded hover:bg-accent"
                title="Sair do modo admin"
              >
                🔓 Admin
              </button>
            ) : (
              <button
                onClick={() => setShowPasswordDialog(true)}
                className="text-[10px] px-2 py-0.5 bg-black/30 text-primary-foreground border border-black/20 rounded hover:bg-black/50"
                title="Entrar como admin"
              >
                🔒
              </button>
            )}
          </div>
        </div>
      </header>

      {showPasswordDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/70" onClick={() => { setShowPasswordDialog(false); setPassword(""); }} />
          <div className="relative z-10 bg-card border-2 border-accent p-4 w-[300px]">
            <div className="retro-section-title text-xs mb-3">🔒 Modo Administrador</div>
            <input
              type="password"
              className="retro-input w-full mb-3"
              placeholder="Digite a senha..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={() => { setShowPasswordDialog(false); setPassword(""); }} className="retro-button flex-1 text-xs py-1">
                Cancelar
              </button>
              <button onClick={handleLogin} className="retro-button flex-1 text-xs py-1">
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RetroHeader;
