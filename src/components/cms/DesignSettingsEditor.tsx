import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Save, Loader2, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface AnnouncementItem {
  text: string;
}

const defaultAnnouncements: AnnouncementItem[] = [
  { text: "Book a Schedule to discuss your business website with Aperio Studios" },
  { text: "We build modern websites for businesses worldwide" },
  { text: "Explore our portfolio to see recent website projects" },
  { text: "Need an e-commerce store? Aperio Studios can help" },
  { text: "Professional websites — Schedule a consultation today" },
  { text: "24/7 support and maintenance for all our website clients" },
];

const DesignSettingsEditor = () => {
  const { loading, upsertContent, publishContent, getContent } = useSiteContent("design");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [announcementLabel, setAnnouncementLabel] = useState("");
  const [copyrightText, setCopyrightText] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  if (!loading && !initialized) {
    setPrimaryColor(getContent("primary_color") || "235 76% 67%");
    setSecondaryColor(getContent("secondary_color") || "187 94% 43%");
    setAnnouncements(getContent("announcements") || defaultAnnouncements);
    setAnnouncementLabel(getContent("announcement_label") || "Update");
    setCopyrightText(getContent("copyright_text") || "© {year} Aperio Studios. All rights reserved.");
    setInitialized(true);
  }

  const handleSave = async () => {
    setSaving(true);
    await upsertContent("design", "primary_color", primaryColor);
    await upsertContent("design", "secondary_color", secondaryColor);
    await upsertContent("design", "announcements", announcements);
    await upsertContent("design", "announcement_label", announcementLabel);
    await upsertContent("design", "copyright_text", copyrightText);
    setSaving(false);
    toast.success("Design settings saved as draft");
  };

  const handlePublish = async () => {
    await handleSave();
    setSaving(true);
    for (const key of ["primary_color", "secondary_color", "announcements", "announcement_label", "copyright_text"]) {
      await publishContent("design", key);
    }
    setSaving(false);
    toast.success("Design settings published!");
  };

  if (loading) return <div className="text-muted-foreground p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-heading text-lg font-semibold text-foreground">Global Design & Settings</h3>
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
          <div className="bg-card rounded-xl p-5 shadow-card">
            <h4 className="font-heading font-semibold text-foreground mb-3">Brand Colors</h4>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-xl border border-border" style={{ backgroundColor: `hsl(${primaryColor})` }} />
                <p className="text-xs text-muted-foreground mt-1">Primary</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-xl border border-border" style={{ backgroundColor: `hsl(${secondaryColor})` }} />
                <p className="text-xs text-muted-foreground mt-1">Secondary</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 shadow-card">
            <h4 className="font-heading font-semibold text-foreground mb-3">Announcement Bar</h4>
            <p className="text-xs text-muted-foreground mb-2">Label: {announcementLabel}</p>
            <div className="space-y-1">
              {announcements.map((a, i) => (
                <p key={i} className="text-sm text-foreground">✦ {a.text}</p>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 shadow-card">
            <p className="text-xs text-muted-foreground">Copyright</p>
            <p className="text-sm text-foreground mt-1">{copyrightText.replace("{year}", String(new Date().getFullYear()))}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h4 className="font-heading font-semibold text-foreground text-sm">Brand Colors (HSL values)</h4>
            <p className="text-xs text-muted-foreground">Enter HSL values without the "hsl()" wrapper, e.g. "235 76% 67%"</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Primary Color</label>
                <div className="flex gap-2 items-center">
                  <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="235 76% 67%" />
                  <div className="w-10 h-10 rounded-lg border border-border shrink-0" style={{ backgroundColor: `hsl(${primaryColor})` }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Secondary Color</label>
                <div className="flex gap-2 items-center">
                  <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} placeholder="187 94% 43%" />
                  <div className="w-10 h-10 rounded-lg border border-border shrink-0" style={{ backgroundColor: `hsl(${secondaryColor})` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h4 className="font-heading font-semibold text-foreground text-sm">Announcement Bar</h4>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Label Text</label>
              <Input value={announcementLabel} onChange={(e) => setAnnouncementLabel(e.target.value)} placeholder="Update" className="w-48" />
            </div>
            <label className="text-xs font-medium text-muted-foreground block">Messages ({announcements.length})</label>
            {announcements.map((a, i) => (
              <div key={i} className="flex gap-2">
                <Input value={a.text} onChange={(e) => { const u = [...announcements]; u[i].text = e.target.value; setAnnouncements(u); }} placeholder="Announcement message" />
                <Button variant="ghost" size="sm" className="text-destructive shrink-0" onClick={() => setAnnouncements(announcements.filter((_, j) => j !== i))}>
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setAnnouncements([...announcements, { text: "" }])}>
              <Plus size={14} className="mr-1" /> Add Message
            </Button>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h4 className="font-heading font-semibold text-foreground text-sm">Copyright Text</h4>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Use {"{year}"} for dynamic year</label>
              <Input value={copyrightText} onChange={(e) => setCopyrightText(e.target.value)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignSettingsEditor;
