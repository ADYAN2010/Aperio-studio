import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth(requiredRole?: "admin" | "user") {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  // Use refs to avoid re-triggering the effect when these change
  const requiredRoleRef = useRef(requiredRole);
  const locationRef = useRef(location.pathname);
  requiredRoleRef.current = requiredRole;
  locationRef.current = location.pathname;
  const hasRedirected = useRef(false);

  useEffect(() => {
    let mounted = true;
    hasRedirected.current = false;

    const checkRole = async (userId: string): Promise<string | null> => {
      try {
        const { data, error } = await supabase.rpc("get_user_role", { _user_id: userId });
        if (error) {
          console.error("useAuth: role check failed", error.message);
          return null;
        }
        return data as string | null;
      } catch (err) {
        console.error("useAuth: role check exception", err);
        return null;
      }
    };

    const handleSession = async (session: { user: User } | null) => {
      if (!mounted) return;

      if (!session?.user) {
        setUser(null);
        setRole(null);
        setLoading(false);
        if (requiredRoleRef.current && !hasRedirected.current) {
          hasRedirected.current = true;
          navigate("/login", { state: { returnTo: locationRef.current }, replace: true });
        }
        return;
      }

      setUser(session.user);
      const userRole = await checkRole(session.user.id);
      if (!mounted) return;

      setRole(userRole);
      setLoading(false);

      if (hasRedirected.current) return;

      if (requiredRoleRef.current === "admin" && userRole !== "admin") {
        hasRedirected.current = true;
        navigate("/login", { state: { returnTo: locationRef.current }, replace: true });
      } else if (requiredRoleRef.current === "user" && userRole === "admin") {
        // Admin trying to access user dashboard — redirect to admin dashboard
        hasRedirected.current = true;
        navigate("/admin-dashboard", { replace: true });
      } else if (requiredRoleRef.current === "user" && !userRole) {
        hasRedirected.current = true;
        navigate("/login", { state: { returnTo: locationRef.current }, replace: true });
      }
    };

    // Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Only handle sign-out / sign-in events, not TOKEN_REFRESHED
        if (_event === "SIGNED_OUT") {
          handleSession(null);
        } else if (_event === "SIGNED_IN" || _event === "INITIAL_SESSION") {
          handleSession(session);
        }
      }
    );

    // Then check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // Only run once per mount — no location.pathname dependency
  }, [navigate]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate("/");
  }, [navigate]);

  return { user, role, loading, logout };
}
