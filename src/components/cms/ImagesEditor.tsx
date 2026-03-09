import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSiteContent, uploadCmsImage } from "@/hooks/useSiteContent";
import { Save, Loader2, Upload, Trash2, Image as ImageIcon } from "lucide-react";

const ImagesEditor = () => {
  const { loading, upsertContent, publishContent, getContent } = useSiteContent("images");
  const [images, setImages] = useState<{ label: string; url: string; key: string }[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!loading && !initialized) {
    setImages(getContent("image_assets") || [
      { label: "Site Logo", url: "", key: "site-logo" },
      { label: "Hero Mockup", url: "", key: "hero-mockup" },
    ]);
    setInitialized(true);
  }

  const handleSave = async () => {
    setSaving(true);
    await upsertContent("images", "image_assets", images);
    setSaving(false);
  };

  const handlePublish = async () => {
    setSaving(true);
    await upsertContent("images", "image_assets", images);
    await publishContent("images", "image_assets");
    setSaving(false);
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploading(index);
    const path = `assets/${images[index].key}-${Date.now()}.${file.name.split(".").pop()}`;
    const url = await uploadCmsImage(file, path);
    if (url) {
      const updated = [...images];
      updated[index].url = url;
      setImages(updated);
    }
    setUploading(null);
  };

  if (loading) return <div className="text-muted-foreground p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-foreground">Image Assets</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span className="ml-1.5">Save Draft</span>
          </Button>
          <Button variant="hero" size="sm" onClick={handlePublish} disabled={saving}>Publish</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
            <Input value={img.label} onChange={(e) => {
              const u = [...images]; u[i].label = e.target.value; setImages(u);
            }} placeholder="Image label" />
            <div className="aspect-video rounded-lg bg-muted/50 border border-border flex items-center justify-center overflow-hidden">
              {img.url ? (
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={32} className="text-muted-foreground/30" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={(el) => { fileRefs.current[i] = el; }}
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(i, e.target.files[0])}
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => fileRefs.current[i]?.click()} disabled={uploading === i}>
                {uploading === i ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                <span className="ml-1.5">Upload</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setImages(images.filter((_, j) => j !== i))}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={() => setImages([...images, { label: "", url: "", key: `custom-${Date.now()}` }])} className="w-full">
        + Add Image Slot
      </Button>
    </div>
  );
};

export default ImagesEditor;
