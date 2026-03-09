import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Save, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const BookingEditor = () => {
  const { loading, upsertContent, publishContent, getContent } = useSiteContent("booking");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [successTitle, setSuccessTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  if (!loading && !initialized) {
    setHeadline(getContent("headline") || "Book a Meeting With Aperio Studios");
    setDescription(getContent("description") || "Schedule a consultation to discuss your business website.");
    setInstructions(getContent("instructions") || "Select a date and time, fill in your details, and confirm your booking. We'll reach out to you before the meeting.");
    setSuccessTitle(getContent("success_title") || "Meeting Scheduled!");
    setSuccessMessage(getContent("success_message") || "Your meeting has been scheduled successfully. Our team will contact you shortly.");
    setInitialized(true);
  }

  const handleSave = async () => {
    setSaving(true);
    await upsertContent("booking", "headline", headline);
    await upsertContent("booking", "description", description);
    await upsertContent("booking", "instructions", instructions);
    await upsertContent("booking", "success_title", successTitle);
    await upsertContent("booking", "success_message", successMessage);
    setSaving(false);
    toast.success("Booking page saved as draft");
  };

  const handlePublish = async () => {
    await handleSave();
    setSaving(true);
    for (const key of ["headline", "description", "instructions", "success_title", "success_message"]) {
      await publishContent("booking", key);
    }
    setSaving(false);
    toast.success("Booking page published!");
  };

  if (loading) return <div className="text-muted-foreground p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-heading text-lg font-semibold text-foreground">Booking Page Content</h3>
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
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-1">Instructions</p>
              <p className="text-sm text-foreground">{instructions}</p>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h4 className="font-heading font-semibold text-foreground mb-2">Success Screen</h4>
            <p className="font-heading text-lg font-bold text-foreground">{successTitle}</p>
            <p className="text-sm text-muted-foreground mt-1">{successMessage}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h4 className="font-heading font-semibold text-foreground text-sm">Booking Page Header</h4>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Headline</label>
              <Input value={headline} onChange={(e) => setHeadline(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Instructions (shown before booking)</label>
              <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h4 className="font-heading font-semibold text-foreground text-sm">Success Screen</h4>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Success Title</label>
              <Input value={successTitle} onChange={(e) => setSuccessTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Success Message</label>
              <Textarea value={successMessage} onChange={(e) => setSuccessMessage(e.target.value)} rows={2} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingEditor;
