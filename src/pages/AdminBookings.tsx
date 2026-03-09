import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Eye, X, CalendarDays, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  website_type: string;
  message: string;
  meeting_date: string;
  meeting_time: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  scheduled: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  cancelled: "bg-muted text-muted-foreground",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("meeting_date", { ascending: true });
    if (error) {
      toast.error("Failed to load bookings.");
    } else {
      setBookings(data as Booking[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      toast.error("Failed to update status.");
    } else {
      toast.success(`Status updated to ${status}.`);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      if (selected?.id === id) setSelected({ ...selected, status });
    }
  };

  const deleteBooking = async (id: string) => {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete booking.");
    } else {
      toast.success("Booking deleted.");
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const totalBookings = bookings.length;
  const upcoming = bookings.filter((b) => b.status === "scheduled" && b.meeting_date >= today).length;
  const completed = bookings.filter((b) => b.status === "completed").length;

  const statCards = [
    { label: "Total Bookings", value: totalBookings, icon: CalendarDays, color: "text-primary" },
    { label: "Upcoming", value: upcoming, icon: Clock, color: "text-warning" },
    { label: "Completed", value: completed, icon: CheckCircle, color: "text-success" },
  ];

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">Bookings</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {statCards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <c.icon size={20} className={c.color} />
              </div>
              <span className="text-sm text-muted-foreground">{c.label}</span>
            </div>
            <p className="font-heading text-3xl font-bold text-foreground">{c.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No bookings yet.</p>
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
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden lg:table-cell">Phone</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden lg:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">Time</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{b.name}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{b.business_name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{b.email}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{b.phone || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{b.website_type || "—"}</td>
                    <td className="px-4 py-3 text-foreground text-xs font-medium">{new Date(b.meeting_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-foreground text-xs hidden md:table-cell">{b.meeting_time}</td>
                    <td className="px-4 py-3">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[b.status] || statusColors.scheduled}`}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelected(b)} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors touch-manipulation" title="View">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => deleteBooking(b.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors touch-manipulation" title="Delete">
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

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border shadow-hero max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-bold text-foreground">Booking Details</h2>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground touch-manipulation">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ["Name", selected.name],
                ["Business", selected.business_name],
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["Website Type", selected.website_type],
                ["Meeting Date", new Date(selected.meeting_date).toLocaleDateString()],
                ["Meeting Time", selected.meeting_time],
                ["Status", selected.status],
                ["Booked On", new Date(selected.created_at).toLocaleString()],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label}>
                  <span className="text-muted-foreground">{label}:</span>
                  <p className="text-foreground font-medium capitalize">{value}</p>
                </div>
              ))}
              {selected.message && (
                <div>
                  <span className="text-muted-foreground">Message:</span>
                  <p className="text-foreground mt-1 whitespace-pre-wrap">{selected.message}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="hero" size="sm" onClick={() => updateStatus(selected.id, "completed")} className="touch-manipulation">
                Mark Completed
              </Button>
              <Button variant="heroOutline" size="sm" onClick={() => updateStatus(selected.id, "cancelled")} className="touch-manipulation">
                Cancel Booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBookings;
