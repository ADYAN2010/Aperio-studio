import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = (location.state as { returnTo?: string })?.returnTo || "/";

  // Redirect away if user is already authenticated
  useEffect(() => {
    let redirected = false;
    const redirect = (session: { user: any } | null) => {
      if (session?.user && !redirected) {
        redirected = true;
        navigate(returnTo, { replace: true });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (_event === "SIGNED_IN" || _event === "INITIAL_SESSION") {
          redirect(session);
        }
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => redirect(session));
    return () => subscription.unsubscribe();
  }, [navigate, returnTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      toast.error("Invalid login credentials.");
      setLoading(false);
      return;
    }

    toast.success("Login successful!");

    // Check if user is admin and redirect accordingly
    if (signInData?.user) {
      const { data: roleData } = await supabase.rpc("get_user_role", { _user_id: signInData.user.id });
      if (roleData === "admin") {
        navigate("/admin-dashboard", { replace: true });
        return;
      }
    }

    navigate(returnTo === "/" ? "/dashboard" : returnTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Login" description="Log in to your Aperio Studios account to manage your website projects and requests." path="/login" />
      <Navbar />
      <section className="pt-36 sm:pt-40 md:pt-44 lg:pt-48 pb-14 sm:pb-16 md:pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <LogIn size={24} className="text-primary" />
                </div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                  Login to Your Account
                </h1>
                <p className="text-muted-foreground text-sm mt-2">
                  Enter your credentials to access your dashboard
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    maxLength={255}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition touch-manipulation"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={128}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition touch-manipulation"
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full touch-manipulation" disabled={loading}>
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </form>

              <div className="mt-4 text-center space-y-2">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={async () => {
                    const trimmedEmail = email.trim();
                    if (!trimmedEmail) {
                      toast.error("Please enter your email address first.");
                      return;
                    }
                    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
                      redirectTo: `${window.location.origin}/login`,
                    });
                    if (error) {
                      toast.error("Failed to send reset email. Please try again.");
                    } else {
                      toast.success("Password reset email sent! Check your inbox.");
                    }
                  }}
                >
                  Forgot Password?
                </button>
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" state={{ returnTo }} className="text-primary font-medium hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Login;
