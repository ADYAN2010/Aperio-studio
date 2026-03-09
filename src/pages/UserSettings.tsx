import { useEffect, useState } from "react";
import UserLayout from "@/components/UserLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const UserSettings = () => {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", business_name: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setForm({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          business_name: data.business_name || "",
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      business_name: form.business_name.trim(),
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);

    if (error) {
      toast.error("Failed to update profile.");
    } else {
      toast.success("Profile updated!");
    }
    setSaving(false);
  };

  if (loading) {
    return <UserLayout><p className="text-muted-foreground">Loading...</p></UserLayout>;
  }

  return (
    <UserLayout>
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">Account Settings</h1>
      <div className="max-w-lg">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} maxLength={100} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input type="email" value={form.email} disabled className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={20} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Business Name</label>
              <input type="text" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} maxLength={100} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition" />
            </div>
            <Button type="submit" variant="hero" size="lg" disabled={saving} className="touch-manipulation">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserSettings;
