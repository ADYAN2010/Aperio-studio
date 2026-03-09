import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    let mounted = true;
    hasRedirected.current = false;

    const handleSession = (session: { user: User } | null) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user && !hasRedirected.current) {
        hasRedirected.current = true;
        navigate("/admin-login", { replace: true });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (_event === "SIGNED_OUT") {
          handleSession(null);
        } else if (_event === "SIGNED_IN" || _event === "INITIAL_SESSION") {
          handleSession(session);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  }, [navigate]);

  return { user, loading, logout };
}
