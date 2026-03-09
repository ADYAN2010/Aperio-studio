import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSiteContent, uploadCmsImage } from "@/hooks/useSiteContent";
import { Save, Loader2, Plus, Trash2, Upload, Eye, EyeOff } from "lucide-react";
import { servicesData } from "@/data/services";
import { toast } from "sonner";

interface ServiceItem {
  title: string;
  description: string;
  image: string;
  slug: string;
}

const defaultServices: ServiceItem[] = servicesData.map((s) => ({
  title: s.title,
  description: s.desc,
  image: s.image,
  slug: s.slug,
}));

const ServicesEditor = () => {
  const { loading, upsertContent, publishContent, getContent } = useSiteContent("services");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!loading && !initialized) {
    const dbServices = getContent("services_list");
    setServices(dbServices && dbServices.length > 0 ? dbServices : defaultServices);
    setInitialized(true);
  }

  const handleSave = async () => {
    setSaving(true);
    await upsertContent("services", "services_list", services);
    setSaving(false);
    toast.success("Services saved as draft");
  };

  const handlePublish = async () => {
    setSaving(true);
    await upsertContent("services", "services_list", services);
    await publishContent("services", "services_list");
    setSaving(false);
    toast.success("Services published!");
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploading(index);
    const path = `services/${Date.now()}-${file.name}`;
    const url = await uploadCmsImage(file, path);
    if (url) {
      const updated = [...services];
      updated[index].image = url;
      setServices(updated);
    }
    setUploading(null);
  };

  const updateService = (index: number, field: keyof ServiceItem, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "title") {
      updated[index].slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    setServices(updated);
  };

  if (loading) return <div className="text-muted-foreground p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-heading text-lg font-semibold text-foreground">Services Content ({services.length})</h3>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((s, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
                {s.image && <img src={s.image} alt={s.title} className="w-full h-32 object-cover" />}
                <div className="p-4">
                  <h5 className="font-heading font-semibold text-foreground">{s.title}</h5>
                  <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Service {i + 1}</span>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setServices(services.filter((_, j) => j !== i))}>
                  <Trash2 size={14} />
                </Button>
              </div>
              <Input value={service.title} onChange={(e) => updateService(i, "title", e.target.value)} placeholder="Service title" />
              <Textarea value={service.description} onChange={(e) => updateService(i, "description", e.target.value)} placeholder="Service description" rows={2} />
              <div className="flex items-center gap-3">
                {service.image && <img src={service.image} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />}
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => { fileRefs.current[i] = el; }}
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(i, e.target.files[0])}
                />
                <Button variant="outline" size="sm" onClick={() => fileRefs.current[i]?.click()} disabled={uploading === i}>
                  {uploading === i ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <span className="ml-1.5">Upload Image</span>
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => setServices([...services, { title: "", description: "", image: "", slug: "" }])} className="w-full">
            <Plus size={16} className="mr-1.5" /> Add Service
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServicesEditor;
