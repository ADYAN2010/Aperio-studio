import { useEffect, useState } from "react";
import UserLayout from "@/components/UserLayout";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Clock, CheckCircle } from "lucide-react";

const UserDashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("website_requests").select("status").eq("user_id", user.id);
      if (data) {
        setStats({
          total: data.length,
          pending: data.filter((r) => r.status === "pending").length,
          completed: data.filter((r) => r.status === "completed").length,
        });
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Requests", value: stats.total, icon: FileText, color: "text-primary" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-warning" },
    { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-success" },
  ];

  return (
    <UserLayout>
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
    </UserLayout>
  );
};

export default UserDashboard;
