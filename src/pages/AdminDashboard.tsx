import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Inbox, CheckCircle, Users, CalendarDays, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface Stats {
  total: number;
  newCount: number;
  contacted: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ total: 0, newCount: 0, contacted: 0 });
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [chatStats, setChatStats] = useState({ total: 0, unread: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.from("messages").select("status");
      if (data) {
        setStats({
          total: data.length,
          newCount: data.filter((m) => m.status === "new").length,
          contacted: data.filter((m) => m.status === "contacted").length,
        });
      }
      const { data: users } = await supabase.from("profiles").select("id");
      if (users) setTotalUsers(users.length);
      const { data: bookings } = await supabase.from("bookings").select("id");
      if (bookings) setTotalBookings(bookings.length);
      const { data: chats } = await supabase.from("chat_messages").select("id, is_read");
      if (chats) setChatStats({ total: chats.length, unread: chats.filter((c) => !c.is_read).length });
    };
    fetchStats();

    const channel = supabase
      .channel("admin-realtime-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        (payload) => {
          const booking = payload.new as { name: string; meeting_date: string; meeting_time: string };
          toast.info(`📅 New booking from ${booking.name}`, {
            description: `${booking.meeting_date} at ${booking.meeting_time}`,
            duration: 8000,
          });
          setTotalBookings((prev) => prev + 1);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as { name: string; email: string };
          toast.info(`✉️ New message from ${msg.name}`, {
            description: msg.email,
            duration: 8000,
          });
          setStats((prev) => ({ ...prev, total: prev.total + 1, newCount: prev.newCount + 1 }));
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const chat = payload.new as { visitor_name: string; sender: string };
          if (chat.sender === "visitor") {
            toast.info(`💬 New chat from ${chat.visitor_name}`, { duration: 6000 });
            setChatStats((prev) => ({ total: prev.total + 1, unread: prev.unread + 1 }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const cards = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "text-primary" },
    { label: "Total Messages", value: stats.total, icon: Inbox, color: "text-primary" },
    { label: "New Messages", value: stats.newCount, icon: MessageSquare, color: "text-warning" },
    { label: "Bookings", value: totalBookings, icon: CalendarDays, color: "text-primary" },
    { label: "Contacted", value: stats.contacted, icon: CheckCircle, color: "text-success" },
    { label: "Chat Messages", value: chatStats.total, icon: MessageCircle, color: "text-primary" },
    { label: "Unread Chats", value: chatStats.unread, icon: MessageCircle, color: "text-warning" },
  ];

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card">
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
    </AdminLayout>
  );
};

export default AdminDashboard;
