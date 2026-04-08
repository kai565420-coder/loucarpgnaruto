import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return localStorage.getItem("admin_mode") === "true";
  });

  const loginAdmin = async (password: string): Promise<boolean> => {
    if (password === "punhetadasfortegames") {
      setIsAdminMode(true);
      localStorage.setItem("admin_mode", "true");
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminMode(false);
    localStorage.removeItem("admin_mode");
  };

  return (
    <AdminContext.Provider value={{ isAdminMode, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};