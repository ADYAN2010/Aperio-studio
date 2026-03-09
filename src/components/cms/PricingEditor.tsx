import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Save, Loader2, Plus, Trash2, Eye, EyeOff, Check } from "lucide-react";
import { toast } from "sonner";

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
}

const defaultPlans: PricingPlan[] = [
  {
    name: "Starter Website",
    price: "৳15,000",
    description: "Perfect for small businesses and personal projects that need a professional online presence.",
    features: ["Up to 5 pages", "Mobile responsive design", "Basic SEO setup", "Contact form integration", "Basic performance optimization"],
    popular: false,
  },
  {
    name: "Small Business Website",
    price: "৳25,000",
    description: "Ideal for growing businesses that need a comprehensive website with advanced features.",
    features: ["Up to 8 pages", "Custom design layout", "SEO optimization", "Google Analytics integration", "Speed optimization"],
    popular: false,
  },
  {
    name: "Professional Business",
    price: "৳40,000",
    description: "Best for established businesses that need advanced design, content, and tracking tools.",
    features: ["Up to 12 pages", "Advanced UI/UX design", "SEO optimization", "Analytics + tracking tools", "Blog system integration"],
    popular: true,
  },
  {
    name: "E-Commerce Website",
    price: "৳60,000",
    description: "Complete online store solution with product management, payments, and order tracking.",
    features: ["Online store system", "Product management dashboard", "Payment gateway integration", "Order management system", "Mobile optimized store"],
    popular: false,
  },
  {
    name: "Enterprise Website",
    price: "৳90,000",
    description: "Fully custom solution for large businesses requiring top-tier design, performance, and support.",
    features: ["Fully custom design", "Advanced SEO strategy", "Automation features", "Advanced performance optimization", "Priority support"],
    popular: false,
  },
];

const PricingEditor = () => {
  const { loading, upsertContent, publishContent, getContent } = useSiteContent("pricing");
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  if (!loading && !initialized) {
    const dbPlans = getContent("pricing_plans");
    setPlans(dbPlans && dbPlans.length > 0 ? dbPlans : defaultPlans);
    setInitialized(true);
  }

  const handleSave = async () => {
    setSaving(true);
    await upsertContent("pricing", "pricing_plans", plans);
    setSaving(false);
    toast.success("Pricing saved as draft");
  };

  const handlePublish = async () => {
    setSaving(true);
    await upsertContent("pricing", "pricing_plans", plans);
    await publishContent("pricing", "pricing_plans");
    setSaving(false);
    toast.success("Pricing published!");
  };

  const updatePlan = (index: number, field: keyof PricingPlan, value: any) => {
    const updated = [...plans];
    updated[index] = { ...updated[index], [field]: value };
    setPlans(updated);
  };

  const updateFeature = (planIndex: number, featureIndex: number, value: string) => {
    const updated = [...plans];
    updated[planIndex].features[featureIndex] = value;
    setPlans(updated);
  };

  if (loading) return <div className="text-muted-foreground p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-heading text-lg font-semibold text-foreground">Pricing Plans ({plans.length})</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
            <span className="ml-1.5">{previewMode ? "Edit" : "Preview"}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span className="ml-1.5">Save Changes</span>
          </Button>
          <Button variant="hero" size="sm" onClick={handlePublish} disabled={saving}>Publish Changes</Button>
        </div>
      </div>

      {previewMode ? (
        <div className="border border-border rounded-xl p-6 bg-muted/30 space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Preview</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan, i) => (
              <div key={i} className={`bg-card border rounded-xl p-5 shadow-card ${plan.popular ? "border-primary ring-1 ring-primary" : "border-border"}`}>
                {plan.popular && <span className="text-xs font-semibold text-primary-foreground bg-primary px-2.5 py-0.5 rounded-full">Most Popular</span>}
                <h5 className="font-heading text-lg font-bold text-foreground mt-2">{plan.name}</h5>
                <p className="text-2xl font-bold text-primary mt-1">{plan.price}</p>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                <ul className="mt-3 space-y-1.5">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-foreground">
                      <Check size={14} className="text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Plan {i + 1}</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                    <input type="checkbox" checked={plan.popular} onChange={(e) => updatePlan(i, "popular", e.target.checked)} className="rounded" />
                    Popular
                  </label>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setPlans(plans.filter((_, j) => j !== i))}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input value={plan.name} onChange={(e) => updatePlan(i, "name", e.target.value)} placeholder="Plan name" />
                <Input value={plan.price} onChange={(e) => updatePlan(i, "price", e.target.value)} placeholder="Price (e.g. ৳15,000)" />
              </div>
              <Textarea value={plan.description} onChange={(e) => updatePlan(i, "description", e.target.value)} placeholder="Plan description" rows={2} />
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Features</label>
                {plan.features.map((f, j) => (
                  <div key={j} className="flex gap-2">
                    <Input value={f} onChange={(e) => updateFeature(i, j, e.target.value)} placeholder={`Feature ${j + 1}`} />
                    <Button variant="ghost" size="sm" className="text-destructive shrink-0" onClick={() => {
                      const updated = [...plans];
                      updated[i].features = updated[i].features.filter((_, k) => k !== j);
                      setPlans(updated);
                    }}><Trash2 size={12} /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => {
                  const updated = [...plans];
                  updated[i].features.push("");
                  setPlans(updated);
                }}>+ Add Feature</Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => setPlans([...plans, { name: "", price: "", description: "", features: [""], popular: false }])} className="w-full">
            <Plus size={16} className="mr-1.5" /> Add Plan
          </Button>
        </div>
      )}
    </div>
  );
};

export default PricingEditor;
