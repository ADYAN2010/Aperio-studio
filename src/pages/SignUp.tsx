import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const COUNTRY_CODES = [
  { code: "+880", country: "🇧🇩 Bangladesh", digits: 10 },
  { code: "+1", country: "🇺🇸 USA / Canada", digits: 10 },
  { code: "+44", country: "🇬🇧 United Kingdom", digits: 10 },
  { code: "+91", country: "🇮🇳 India", digits: 10 },
  { code: "+61", country: "🇦🇺 Australia", digits: 9 },
  { code: "+971", country: "🇦🇪 UAE", digits: 9 },
  { code: "+966", country: "🇸🇦 Saudi Arabia", digits: 9 },
  { code: "+60", country: "🇲🇾 Malaysia", digits: 10 },
  { code: "+65", country: "🇸🇬 Singapore", digits: 8 },
  { code: "+49", country: "🇩🇪 Germany", digits: 11 },
  { code: "+33", country: "🇫🇷 France", digits: 9 },
  { code: "+39", country: "🇮🇹 Italy", digits: 10 },
  { code: "+81", country: "🇯🇵 Japan", digits: 10 },
  { code: "+82", country: "🇰🇷 South Korea", digits: 10 },
  { code: "+86", country: "🇨🇳 China", digits: 11 },
  { code: "+55", country: "🇧🇷 Brazil", digits: 11 },
  { code: "+234", country: "🇳🇬 Nigeria", digits: 10 },
  { code: "+27", country: "🇿🇦 South Africa", digits: 9 },
  { code: "+92", country: "🇵🇰 Pakistan", digits: 10 },
  { code: "+63", country: "🇵🇭 Philippines", digits: 10 },
];

const SignUp = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    password: "",
    confirmPassword: "",
  });
  const [countryCode, setCountryCode] = useState("+880");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = (location.state as { returnTo?: string })?.returnTo || "/";

  // Redirect away if user is already authenticated
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          navigate(returnTo, { replace: true });
        }
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate(returnTo, { replace: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate, returnTo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePhone = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.phone.trim()) {
      toast.error("Please enter a valid mobile number.");
      return;
    }
    if (!validatePhone(form.phone)) {
      toast.error("Please enter a valid mobile number (10–15 digits).");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    const sanitizedPhone = form.phone.replace(/[^\d+\-() ]/g, "").trim();
    const fullPhone = `${countryCode} ${sanitizedPhone}`;

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          full_name: form.fullName.trim(),
          phone: fullPhone,
          business_name: form.businessName.trim(),
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Account created successfully!");
    navigate(returnTo, { replace: true });
  };

  const fields = [
    { name: "fullName", label: "Full Name", type: "text", placeholder: "John Doe", required: true },
    { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com", required: true },
    { name: "phone", label: "Mobile Number", type: "tel", placeholder: "1XXX-XXXXXX", required: true },
    { name: "businessName", label: "Business Name", type: "text", placeholder: "Your Business", required: false },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••", required: true },
    { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "••••••••", required: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Sign Up" description="Create an Aperio Studios account to get started with your website project. Free consultation included." path="/signup" />
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
                  <UserPlus size={24} className="text-primary" />
                </div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                  Create Your Account
                </h1>
                <p className="text-muted-foreground text-sm mt-2">
                  Sign up to get started with Aperio Studios
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {f.label} {f.required && <span className="text-destructive">*</span>}
                    </label>
                    {f.name === "phone" ? (
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-[120px] rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.country} value={c.code}>
                              {c.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type={f.type}
                          name={f.name}
                          value={form[f.name as keyof typeof form]}
                          onChange={handleChange}
                          maxLength={255}
                          required={f.required}
                          className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition touch-manipulation"
                          placeholder={f.placeholder}
                        />
                      </div>
                    ) : (
                      <input
                        type={f.type}
                        name={f.name}
                        value={form[f.name as keyof typeof form]}
                        onChange={handleChange}
                        maxLength={255}
                        required={f.required}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition touch-manipulation"
                        placeholder={f.placeholder}
                      />
                    )}
                  </div>
                ))}
                <Button type="submit" variant="hero" size="lg" className="w-full touch-manipulation" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" state={{ returnTo }} className="text-primary font-medium hover:underline">
                  Login
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SignUp;
