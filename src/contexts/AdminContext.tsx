import { createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AdminContextType {
  isAdminMode: boolean;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdminMode: false,
  loginAdmin: async () => false,
  logoutAdmin: () => {},
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin, refreshRole, user } = useAuth();

  const loginAdmin = async (password: string): Promise<boolean> => {
    if (!user) return false;
    const { data, error } = await supabase.functions.invoke("claim-admin", {
      body: { password },
    });
    if (error || !data?.ok) return false;
    await refreshRole();
    return true;
  };

  const logoutAdmin = () => {
    // O papel de administrador é permanente na conta; sair do modo = sair da conta.
    supabase.auth.signOut();
  };

  return (
    <AdminContext.Provider value={{ isAdminMode: isAdmin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
