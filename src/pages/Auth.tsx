import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const nextParam = params.get("next");
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/";

  useEffect(() => {
    if (!loading && user) navigate(next, { replace: true });
  }, [loading, user, next, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}${next}` },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail se for solicitado.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao entrar");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${next}` },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="retro-panel p-4 w-full max-w-[360px]">
        <h1 className="retro-section-title text-sm">
          {mode === "login" ? "🔑 Entrar" : "🥷 Criar Conta"}
        </h1>
        <p className="text-[10px] text-muted-foreground mb-3">
          Sua conta protege sua ficha: só você (e os administradores) podem editá-la.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="retro-label block mb-1">E-mail:</label>
          <input
            type="email"
            required
            className="retro-input w-full mb-2 text-xs"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="retro-label block mb-1">Senha:</label>
          <input
            type="password"
            required
            minLength={6}
            className="retro-input w-full mb-3 text-xs"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="retro-button w-full py-2 text-xs" disabled={busy}>
            {busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button onClick={handleGoogle} className="retro-button w-full py-2 text-xs mt-2">
          Entrar com Google
        </button>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="text-[10px] text-accent hover:underline mt-3 block mx-auto"
        >
          {mode === "login" ? "Não tem conta? Criar uma" : "Já tem conta? Entrar"}
        </button>

        <button
          onClick={() => navigate("/")}
          className="text-[10px] text-muted-foreground hover:underline mt-2 block mx-auto"
        >
          Voltar para as fichas
        </button>
      </div>
    </div>
  );
};

export default Auth;
