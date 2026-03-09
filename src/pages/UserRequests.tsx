import { useEffect, useState } from "react";
import UserLayout from "@/components/UserLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

interface Request {
  id: string;
  title: string;
  description: string;
  website_type: string;
  status: string;
  admin_notes: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  "in progress": "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
};

const UserRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", website_type: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from("website_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setRequests(data as Request[]);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Please enter a title."); return; }
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("website_requests").insert({
      user_id: user.id,
      title: form.title.trim(),
      description: form.description.trim(),
      website_type: form.website_type.trim(),
    });

    if (error) {
      toast.error("Failed to submit request.");
    } else {
      toast.success("Request submitted!");
      setForm({ title: "", description: "", website_type: "" });
      setShowForm(false);
      fetchRequests();
    }
    setSubmitting(false);
  };

  return (
    <UserLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">My Requests</h1>
        <Button variant="hero" size="sm" onClick={() => setShowForm(!showForm)} className="touch-manipulation">
          {showForm ? <X size={16} className="mr-1" /> : <Plus size={16} className="mr-1" />}
          {showForm ? "Cancel" : "New Request"}
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card mb-6">
          <h2 className="font-heading text-lg font-bold text-foreground mb-4">Submit New Website Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Project Title <span className="text-destructive">*</span></label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} required className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition" placeholder="My Website Project" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Website Type</label>
              <select value={form.website_type} onChange={(e) => setForm({ ...form, website_type: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition">
                <option value="">Select type</option>
                <option>Business Website</option>
                <option>E-commerce Website</option>
                <option>Portfolio Website</option>
                <option>Blog / Content Site</option>
                <option>Landing Page</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={2000} rows={4} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none" placeholder="Describe your project requirements..." />
            </div>
            <Button type="submit" variant="hero" size="lg" disabled={submitting} className="touch-manipulation">
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading requests...</p>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No requests yet. Submit your first website request!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading font-bold text-foreground">{r.title}</h3>
                  {r.website_type && <p className="text-xs text-muted-foreground mt-0.5">{r.website_type}</p>}
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${statusColors[r.status] || statusColors.pending}`}>
                  {r.status}
                </span>
              </div>
              {r.description && <p className="text-sm text-muted-foreground mt-3">{r.description}</p>}
              {r.admin_notes && (
                <div className="mt-3 p-3 rounded-xl bg-muted/50 border border-border">
                  <p className="text-xs font-medium text-foreground mb-1">Admin Notes:</p>
                  <p className="text-sm text-muted-foreground">{r.admin_notes}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">{new Date(r.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </UserLayout>
  );
};

export default UserRequests;
