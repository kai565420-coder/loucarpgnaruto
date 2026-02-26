import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUserIp() {
  const [ip, setIp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIp() {
      try {
        const { data, error } = await supabase.functions.invoke("get-ip");
        if (error) throw error;
        setIp(data.ip);
      } catch (e) {
        console.error("Erro ao obter IP:", e);
        // Fallback: use a public API
        try {
          const res = await fetch("https://api.ipify.org?format=json");
          const json = await res.json();
          setIp(json.ip);
        } catch {
          setIp("unknown");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchIp();
  }, []);

  return { ip, loading };
}
