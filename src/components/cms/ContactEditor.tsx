import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Save, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const ContactEditor = () => {
  const { loading, upsertContent, publishContent, getContent } = useSiteContent("contact");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [location, setLocation] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [supportInfo, setSupportInfo] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  if (!loading && !initialized) {
    setHeadline(getContent("headline") || "Let's Build Your Business Website");
    setDescription(getContent("description") || "Ready to grow your business online? Get in touch with Aperio Studios through any of the methods below. We respond within 24 hours.");
    setEmail(getContent("email") || "hello@aperiostudios.com");
    setPhone(getContent("phone") || "+880 1XXX-XXXXXX");
    setWhatsapp(getContent("whatsapp") || "https://wa.me/8801XXXXXXXXX");
    setLocation(getContent("location") || "Dhaka, Bangladesh");
    setFormDescription(getContent("form_description") || "Fill out the form below and we'll get back to you within 24 hours with a personalized response.");
    setSupportInfo(getContent("support_info") || "We respond within 24 hours");
    setInitialized(true);
  }

  const handleSave = async () => {
    setSaving(true);
    await upsertContent("contact", "headline", headline);
    await upsertContent("contact", "description", description);
    await upsertContent("contact", "email", email);
    await upsertContent("contact", "phone", phone);
    await upsertContent("contact", "whatsapp", whatsapp);
    await upsertContent("contact", "location", location);
    await upsertContent("contact", "form_description", formDescription);
    await upsertContent("contact", "support_info", supportInfo);
    setSaving(false);
    toast.success("Contact page saved as draft");
  };

  const handlePublish = async () => {
    await handleSave();
    setSaving(true);
    for (const key of ["headline", "description", "email", "phone", "whatsapp", "location", "form_description", "support_info"]) {
      await publishContent("contact", key);
    }
    setSaving(false);
    toast.success("Contact page published!");
  };

  if (loading) return <div className="text-muted-foreground p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-heading text-lg font-semibold text-foreground">Contact Page Content</h3>
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
          <div className="bg-card rounded-xl p-5 shadow-card grid grid-cols-2 gap-3">
            <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium text-foreground">{email}</p></div>
            <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium text-foreground">{phone}</p></div>
            <div><p className="text-xs text-muted-foreground">WhatsApp</p><p className="text-sm font-medium text-foreground">{whatsapp}</p></div>
            <div><p className="text-xs text-muted-foreground">Location</p><p className="text-sm font-medium text-foreground">{location}</p></div>
          </div>
          <div className="bg-card rounded-xl p-5 shadow-card">
            <p className="text-xs text-muted-foreground">Form Description</p>
            <p className="text-sm text-foreground mt-1">{formDescription}</p>
            <p className="text-xs text-muted-foreground mt-3">Support Info</p>
            <p className="text-sm text-foreground mt-1">{supportInfo}</p>
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
            <h4 className="font-heading font-semibold text-foreground text-sm">Contact Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Email Address</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone Number</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">WhatsApp Link</label>
                <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Office Location</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h4 className="font-heading font-semibold text-foreground text-sm">Form & Support</h4>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Contact Form Description</label>
              <Textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={2} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Support Information</label>
              <Input value={supportInfo} onChange={(e) => setSupportInfo(e.target.value)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactEditor;
