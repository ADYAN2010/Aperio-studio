import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  business_name: string;
  created_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (!error && data) setUsers(data as Profile[]);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">Users</h1>
      {loading ? (
        <p className="text-muted-foreground">Loading users...</p>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No users registered yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">Mobile Number</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground hidden lg:table-cell">Business</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{u.full_name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{u.email}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{u.phone || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{u.business_name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
