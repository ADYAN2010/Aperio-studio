import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  name: string;
  business_name: string | null;
  email: string;
  phone: string | null;
  website_type: string | null;
  message: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: "bg-warning/10 text-warning",
  contacted: "bg-primary/10 text-primary",
  closed: "bg-muted text-muted-foreground",
};

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load messages.");
    } else {
      setMessages(data as Message[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("messages")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update status.");
    } else {
      toast.success(`Status updated to ${status}.`);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      if (selected?.id === id) setSelected({ ...selected, status });
    }
  };

  const deleteMessage = async (id: string) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete message.");
    } else {
      toast.success("Message deleted.");
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">
        Messages
      </h1>

      {loading ? (
        <p className="text-muted-foreground">Loading messages...</p>
      ) : messages.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No messages yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">Business</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden lg:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{m.name}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{m.business_name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{m.email}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{m.website_type || "—"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={m.status}
                        onChange={(e) => updateStatus(m.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[m.status] || statusColors.new}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelected(m)}
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors touch-manipulation"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => deleteMessage(m.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors touch-manipulation"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border shadow-hero max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-bold text-foreground">Message Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground touch-manipulation"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="text-foreground font-medium">{selected.name}</p>
              </div>
              {selected.business_name && (
                <div>
                  <span className="text-muted-foreground">Business:</span>
                  <p className="text-foreground font-medium">{selected.business_name}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="text-foreground font-medium">{selected.email}</p>
              </div>
              {selected.phone && (
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="text-foreground font-medium">{selected.phone}</p>
                </div>
              )}
              {selected.website_type && (
                <div>
                  <span className="text-muted-foreground">Website Type:</span>
                  <p className="text-foreground font-medium">{selected.website_type}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className="text-foreground font-medium capitalize">{selected.status}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>
                <p className="text-foreground font-medium">
                  {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Message:</span>
                <p className="text-foreground mt-1 whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                variant="hero"
                size="sm"
                onClick={() => updateStatus(selected.id, "contacted")}
                className="touch-manipulation"
              >
                Mark Contacted
              </Button>
              <Button
                variant="heroOutline"
                size="sm"
                onClick={() => updateStatus(selected.id, "closed")}
                className="touch-manipulation"
              >
                Mark Closed
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMessages;
