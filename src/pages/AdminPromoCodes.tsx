import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Ticket, BarChart3 } from "lucide-react";

interface PromoCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
  expires_at: string | null;
  usage_count: number;
  max_uses: number | null;
  created_at: string;
}

const AdminPromoCodes = () => {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);

  // New code form
  const [newCode, setNewCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchCodes = async () => {
    const { data } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setCodes((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleCreate = async () => {
    if (!newCode.trim() || !discountValue) {
      toast.error("Code and discount value are required");
      return;
    }
    setCreating(true);
    const { error } = await supabase.from("promo_codes").insert({
      code: newCode.trim().toUpperCase(),
      discount_type: discountType,
      discount_value: Number(discountValue),
      expires_at: expiresAt || null,
      max_uses: maxUses ? Number(maxUses) : null,
    } as any);

    if (error) {
      toast.error(error.message.includes("duplicate") ? "Code already exists" : error.message);
    } else {
      toast.success("Promo code created");
      setNewCode("");
      setDiscountValue("");
      setExpiresAt("");
      setMaxUses("");
      fetchCodes();
    }
    setCreating(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("promo_codes").update({ is_active: !current } as any).eq("id", id);
    fetchCodes();
  };

  const deleteCode = async (id: string) => {
    await supabase.from("promo_codes").delete().eq("id", id);
    toast.success("Code deleted");
    fetchCodes();
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Ticket size={28} className="text-primary" />
            Promo Codes
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Create and manage discount codes for pricing packages.</p>
        </div>

        {/* Create form */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
            <Plus size={18} className="text-primary" /> Create New Code
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Code</Label>
              <Input
                placeholder="e.g. SAVE20"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                className="font-mono uppercase tracking-wider"
              />
            </div>
            <div>
              <Label>Discount Type</Label>
              <Select value={discountType} onValueChange={setDiscountType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Discount Value</Label>
              <Input
                type="number"
                placeholder={discountType === "percentage" ? "e.g. 20" : "e.g. 5000"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
            </div>
            <div>
              <Label>Expiration Date (optional)</Label>
              <Input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
            <div>
              <Label>Max Uses (optional)</Label>
              <Input
                type="number"
                placeholder="Unlimited"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleCreate} disabled={creating} variant="hero" className="w-full gap-2">
                <Plus size={16} />
                {creating ? "Creating..." : "Create Code"}
              </Button>
            </div>
          </div>
        </div>

        {/* Codes list */}
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-border">
            <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
              <BarChart3 size={18} className="text-primary" /> All Promo Codes
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : codes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No promo codes yet. Create one above.</div>
          ) : (
            <div className="divide-y divide-border">
             {codes.map((code) => {
                const isExpired = code.expires_at && new Date(code.expires_at) < new Date();
                const isMaxedOut = code.max_uses !== null && code.usage_count >= code.max_uses;
                const statusLabel = !code.is_active ? "Expired" : isExpired ? "Expired" : isMaxedOut ? "Expired" : "Active";
                const statusClass = statusLabel === "Active"
                  ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";

                return (
                  <div key={code.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono font-bold text-foreground tracking-wider text-lg">{code.code}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {code.discount_type === "percentage" ? `${code.discount_value}% off` : `৳${Number(code.discount_value).toLocaleString()} off`}
                        {code.expires_at && ` · Expires ${new Date(code.expires_at).toLocaleDateString()}`}
                      </p>
                      <div className="flex items-center gap-4 mt-1.5">
                        <span className="text-xs text-muted-foreground">
                          Usage: <span className="font-semibold text-foreground">{code.usage_count}</span>
                          {code.max_uses !== null ? ` / ${code.max_uses}` : " / ∞"}
                        </span>
                        {code.max_uses !== null && (
                          <div className="flex-1 max-w-[120px] h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${Math.min(100, (code.usage_count / code.max_uses) * 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Active</Label>
                        <Switch
                          checked={code.is_active}
                          onCheckedChange={() => toggleActive(code.id, code.is_active)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => deleteCode(code.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPromoCodes;
