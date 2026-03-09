import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSiteContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Save, Loader2, Plus, Trash2, Eye, EyeOff, Upload, ArrowUp, ArrowDown, User } from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  name: string;
  role: string;
  desc: string;
  image?: string;
}

interface StatItem {
  value: string;
  label: string;
}

const defaultStats: StatItem[] = [
  { value: "50+", label: "Happy Clients" },
  { value: "80+", label: "Websites Built" },
  { value: "99%", label: "Client Satisfaction" },
  { value: "3+", label: "Years Experience" },
];

const defaultTeam: TeamMember[] = [
  { name: "Arif Rahman", role: "Founder & Lead Developer", desc: "Full-stack developer with 5+ years of experience, passionate about empowering Bangladeshi businesses through professional web solutions.", image: "" },
  { name: "Nusrat Jahan", role: "UI/UX Designer", desc: "Creates intuitive, modern designs that help businesses make a powerful first impression and keep visitors engaged.", image: "" },
  { name: "Tanvir Hasan", role: "SEO & Marketing Specialist", desc: "Helps clients dominate search results and grow their online visibility with data-driven strategies and proven techniques.", image: "" },
];

const AboutEditor = () => {
  const { loading, upsertContent, publishContent, getContent } = useSiteContent("about");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [stats, setStats] = useState<StatItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  if (!loading && !initialized) {
    setHeadline(getContent("headline") || "Building Digital Success for Businesses");
    setDescription(getContent("description") || "Aperio Studios is a professional web development studio dedicated to helping businesses establish and grow their online presence through modern, affordable websites.");
    setMission(getContent("mission") || "To empower businesses in Bangladesh by providing professional, affordable website development services that help them establish a strong digital presence and reach more customers.");
    setVision(getContent("vision") || "To become the most trusted web development partner for businesses across Bangladesh, enabling every enterprise — no matter how small — to compete and thrive in the digital economy.");
    setStats(getContent("stats") || defaultStats);
    setTeam(getContent("team") || defaultTeam);
    setInitialized(true);
  }

  const handleImageUpload = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploadingIndex(index);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `team/${Date.now()}-${index}.${ext}`;

    const { error } = await supabase.storage.from("cms-images").upload(path, file, { upsert: true });
    if (error) {
      toast.error("Upload failed: " + error.message);
      setUploadingIndex(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("cms-images").getPublicUrl(path);
    const updated = [...team];
    updated[index] = { ...updated[index], image: urlData.publicUrl };
    setTeam(updated);
    setUploadingIndex(null);
    toast.success("Image uploaded");
  };

  const moveTeamMember = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= team.length) return;
    const updated = [...team];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setTeam(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    await upsertContent("about", "headline", headline);
    await upsertContent("about", "description", description);
    await upsertContent("about", "mission", mission);
    await upsertContent("about", "vision", vision);
    await upsertContent("about", "stats", stats);
    await upsertContent("about", "team", team);
    setSaving(false);
    toast.success("About page saved as draft");
  };

  const handlePublish = async () => {
    await handleSave();
    setSaving(true);
    for (const key of ["headline", "description", "mission", "vision", "stats", "team"]) {
      await publishContent("about", key);
    }
    setSaving(false);
    toast.success("About page published!");
  };

  if (loading) return <div className="text-muted-foreground p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-heading text-lg font-semibold text-foreground">About Page Content</h3>
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
        <div className="border border-border rounded-xl p-6 bg-muted/30 space-y-4">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Preview</h4>
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h1 className="font-heading text-2xl font-bold text-foreground">{headline}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-5 shadow-card">
              <h4 className="font-heading font-semibold text-foreground mb-2">Mission</h4>
              <p className="text-sm text-muted-foreground">{mission}</p>
            </div>
            <div className="bg-card rounded-xl p-5 shadow-card">
              <h4 className="font-heading font-semibold text-foreground mb-2">Vision</h4>
              <p className="text-sm text-muted-foreground">{vision}</p>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 shadow-card">
            <h4 className="font-heading font-semibold text-foreground mb-3">Stats</h4>
            <div className="grid grid-cols-4 gap-3">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="font-heading text-xl font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 shadow-card">
            <h4 className="font-heading font-semibold text-foreground mb-3">Team ({team.length})</h4>
            <div className="grid grid-cols-3 gap-4">
              {team.map((m, i) => (
                <div key={i} className="text-center">
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-2" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <span className="font-heading text-lg font-bold text-primary">
                        {m.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                  )}
                  <p className="font-medium text-foreground text-sm">{m.name}</p>
                  <p className="text-xs text-primary">{m.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h4 className="font-heading font-semibold text-foreground text-sm">Hero Section</h4>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Headline</label>
              <Input value={headline} onChange={(e) => setHeadline(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h4 className="font-heading font-semibold text-foreground text-sm">Mission & Vision</h4>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Mission Statement</label>
              <Textarea value={mission} onChange={(e) => setMission(e.target.value)} rows={3} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Vision Statement</label>
              <Textarea value={vision} onChange={(e) => setVision(e.target.value)} rows={3} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h4 className="font-heading font-semibold text-foreground text-sm">Stats ({stats.length})</h4>
            {stats.map((s, i) => (
              <div key={i} className="flex gap-2">
                <Input value={s.value} onChange={(e) => { const u = [...stats]; u[i].value = e.target.value; setStats(u); }} placeholder="Value (e.g. 50+)" className="w-28" />
                <Input value={s.label} onChange={(e) => { const u = [...stats]; u[i].label = e.target.value; setStats(u); }} placeholder="Label" className="flex-1" />
                <Button variant="ghost" size="sm" className="text-destructive shrink-0" onClick={() => setStats(stats.filter((_, j) => j !== i))}>
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setStats([...stats, { value: "", label: "" }])}>
              <Plus size={14} className="mr-1" /> Add Stat
            </Button>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h4 className="font-heading font-semibold text-foreground text-sm">Team Members ({team.length})</h4>
            {team.map((m, i) => (
              <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-4">
                  {/* Image upload area */}
                  <div className="shrink-0 flex flex-col items-center gap-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={(el) => { fileInputRefs.current[i] = el; }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(i, file);
                        e.target.value = "";
                      }}
                    />
                    {m.image ? (
                      <div
                        className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border cursor-pointer group"
                        onClick={() => fileInputRefs.current[i]?.click()}
                      >
                        <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload size={16} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[i]?.click()}
                        className="w-20 h-20 rounded-full border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors cursor-pointer"
                      >
                        {uploadingIndex === i ? (
                          <Loader2 size={18} className="text-muted-foreground animate-spin" />
                        ) : (
                          <>
                            <User size={18} className="text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">Upload</span>
                          </>
                        )}
                      </button>
                    )}
                    {m.image && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive text-[10px] h-6 px-2"
                        onClick={() => {
                          const u = [...team];
                          u[i] = { ...u[i], image: "" };
                          setTeam(u);
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Name</label>
                        <Input value={m.name} onChange={(e) => { const u = [...team]; u[i].name = e.target.value; setTeam(u); }} placeholder="Name" />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Role / Position</label>
                        <Input value={m.role} onChange={(e) => { const u = [...team]; u[i].role = e.target.value; setTeam(u); }} placeholder="Role" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">Bio / Description</label>
                      <Textarea value={m.desc} onChange={(e) => { const u = [...team]; u[i].desc = e.target.value; setTeam(u); }} placeholder="Short bio" rows={2} />
                    </div>
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex items-center justify-between border-t border-border pt-2">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={i === 0} onClick={() => moveTeamMember(i, "up")}>
                      <ArrowUp size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={i === team.length - 1} onClick={() => moveTeamMember(i, "down")}>
                      <ArrowDown size={14} />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive h-7" onClick={() => setTeam(team.filter((_, j) => j !== i))}>
                    <Trash2 size={14} className="mr-1" /> Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setTeam([...team, { name: "", role: "", desc: "", image: "" }])}>
              <Plus size={14} className="mr-1" /> Add Team Member
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutEditor;
