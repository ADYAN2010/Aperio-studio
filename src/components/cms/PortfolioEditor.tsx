import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSiteContent, uploadCmsImage } from "@/hooks/useSiteContent";
import { Save, Loader2, Plus, Trash2, Upload, Eye, EyeOff } from "lucide-react";
import { projectsData } from "@/data/projects";
import { toast } from "sonner";

interface PortfolioItem {
  title: string;
  description: string;
  image: string;
  type: string;
  slug: string;
}

const defaultProjects: PortfolioItem[] = projectsData.map((p) => ({
  title: p.title,
  description: p.desc,
  image: p.img,
  type: p.type,
  slug: p.slug,
}));

const PortfolioEditor = () => {
  const { loading, upsertContent, publishContent, getContent } = useSiteContent("portfolio");
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!loading && !initialized) {
    const dbProjects = getContent("portfolio_list");
    setProjects(dbProjects && dbProjects.length > 0 ? dbProjects : defaultProjects);
    setInitialized(true);
  }

  const handleSave = async () => {
    setSaving(true);
    await upsertContent("portfolio", "portfolio_list", projects);
    setSaving(false);
    toast.success("Portfolio saved as draft");
  };

  const handlePublish = async () => {
    setSaving(true);
    await upsertContent("portfolio", "portfolio_list", projects);
    await publishContent("portfolio", "portfolio_list");
    setSaving(false);
    toast.success("Portfolio published!");
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploading(index);
    const path = `portfolio/${Date.now()}-${file.name}`;
    const url = await uploadCmsImage(file, path);
    if (url) {
      const updated = [...projects];
      updated[index].image = url;
      setProjects(updated);
    }
    setUploading(null);
  };

  const updateProject = (index: number, field: keyof PortfolioItem, value: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "title") {
      updated[index].slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    setProjects(updated);
  };

  if (loading) return <div className="text-muted-foreground p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-heading text-lg font-semibold text-foreground">Portfolio Content ({projects.length})</h3>
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
            {projects.map((p, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
                {p.image && <img src={p.image} alt={p.title} className="w-full aspect-video object-cover" />}
                <div className="p-4">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{p.type}</span>
                  <h5 className="font-heading font-semibold text-foreground mt-2">{p.title}</h5>
                  <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Project {i + 1}</span>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setProjects(projects.filter((_, j) => j !== i))}>
                  <Trash2 size={14} />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input value={project.title} onChange={(e) => updateProject(i, "title", e.target.value)} placeholder="Project title" />
                <Input value={project.type} onChange={(e) => updateProject(i, "type", e.target.value)} placeholder="Type (e.g. E-commerce)" />
              </div>
              <Textarea value={project.description} onChange={(e) => updateProject(i, "description", e.target.value)} placeholder="Project description" rows={2} />
              <div className="flex items-center gap-3">
                {project.image && <img src={project.image} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />}
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
          <Button variant="outline" onClick={() => setProjects([...projects, { title: "", description: "", image: "", type: "", slug: "" }])} className="w-full">
            <Plus size={16} className="mr-1.5" /> Add Project
          </Button>
        </div>
      )}
    </div>
  );
};

export default PortfolioEditor;
