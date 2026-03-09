import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useSiteContent, uploadCmsImage } from "@/hooks/useSiteContent";
import {
  Save, Loader2, Upload, Trash2, Image as ImageIcon, Eye, EyeOff,
  Monitor, Tablet, Smartphone, ZoomIn, Move, Lock, Unlock, Globe
} from "lucide-react";
import { toast } from "sonner";
import defaultLogo from "@/assets/aperio-logo.png";

interface LogoSettings {
  url: string;
  height: number;
  width: number;
  padding: number;
  lockAspectRatio: boolean;
  naturalWidth: number;
  naturalHeight: number;
}

const defaultSettings: LogoSettings = {
  url: "",
  height: 40,
  width: 120,
  padding: 0,
  lockAspectRatio: true,
  naturalWidth: 0,
  naturalHeight: 0,
};

type PreviewDevice = "desktop" | "tablet" | "mobile";

const LogoEditor = () => {
  const { loading, upsertContent, publishContent, getContent } = useSiteContent("images");
  const { getContent: getNavContent } = useSiteContent("navigation");
  const [settings, setSettings] = useState<LogoSettings>(defaultSettings);
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");

  // Crop state
  const [cropMode, setCropMode] = useState(false);
  const [zoom, setZoom] = useState([1]);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropImageRef = useRef<HTMLImageElement | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);

  // Logo history for media library
  const [logoHistory, setLogoHistory] = useState<string[]>([]);

  // Favicon state
  const [faviconUrl, setFaviconUrl] = useState<string>("");
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const faviconFileRef = useRef<HTMLInputElement>(null);

  const brandName = getNavContent("brand_name") || "Aperio Studios";

  if (!loading && !initialized) {
    const saved = getContent("logo_settings") as LogoSettings | null;
    if (saved && saved.url) {
      setSettings(saved);
    } else {
      // Fall back: check image_assets for site-logo, then use the bundled default
      const existingAssets = getContent("image_assets") as { label: string; url: string; key: string }[] | null;
      const siteLogoAsset = existingAssets?.find((a) => a.key === "site-logo" || a.label.toLowerCase().includes("logo"));
      const fallbackUrl = siteLogoAsset?.url || defaultLogo;
      setSettings((prev) => ({
        ...prev,
        ...(saved || {}),
        url: fallbackUrl,
      }));
    }
    const history = getContent("logo_history") as string[] | null;
    if (history) setLogoHistory(history);
    const savedFavicon = getContent("favicon_url") as string | null;
    if (savedFavicon) setFaviconUrl(savedFavicon);
    setInitialized(true);
  }

  const update = (partial: Partial<LogoSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      // Maintain aspect ratio
      if (prev.lockAspectRatio && prev.naturalWidth > 0 && prev.naturalHeight > 0) {
        const ratio = prev.naturalWidth / prev.naturalHeight;
        if (partial.height !== undefined && partial.width === undefined) {
          next.width = Math.round(partial.height * ratio);
        } else if (partial.width !== undefined && partial.height === undefined) {
          next.height = Math.round(partial.width / ratio);
        }
      }
      return next;
    });
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploading(true);
    const path = `logos/logo-${Date.now()}.${file.name.split(".").pop()}`;
    const url = await uploadCmsImage(file, path);
    if (url) {
      // Get natural dimensions
      const img = new Image();
      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        const newHeight = 40;
        const newWidth = Math.round(newHeight * ratio);
        setSettings((prev) => ({
          ...prev,
          url,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          height: newHeight,
          width: newWidth,
        }));
        // Logo will sync to image_assets on save
        // Add to history
        setLogoHistory((prev) => {
          const updated = [url, ...prev.filter((u) => u !== url)].slice(0, 10);
          return updated;
        });
      };
      img.src = url;
    }
    setUploading(false);
  };

  const handleDelete = () => {
    setSettings((prev) => ({ ...prev, url: "" }));
    toast.info("Logo removed. Save to apply changes.");
  };

  const handleFaviconUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, ICO, SVG recommended)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Favicon must be under 2MB");
      return;
    }
    setUploadingFavicon(true);
    const ext = file.name.split(".").pop();
    const path = `favicons/favicon-${Date.now()}.${ext}`;
    const url = await uploadCmsImage(file, path);
    if (url) {
      setFaviconUrl(url);
      toast.success("Favicon uploaded. Save & publish to apply.");
    }
    setUploadingFavicon(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await upsertContent("images", "logo_settings", settings);
    await upsertContent("images", "logo_history", logoHistory);
    await upsertContent("images", "favicon_url", faviconUrl);

    // Also update the image_assets to keep site-logo in sync
    const existingAssets = getContent("image_assets") as { label: string; url: string; key: string }[] | null;
    const assets = existingAssets ? [...existingAssets] : [{ label: "Site Logo", url: "", key: "site-logo" }];
    const logoIdx = assets.findIndex((a) => a.key === "site-logo" || a.label.toLowerCase().includes("logo"));
    if (logoIdx >= 0) {
      assets[logoIdx].url = settings.url;
    } else {
      assets.unshift({ label: "Site Logo", url: settings.url, key: "site-logo" });
    }
    await upsertContent("images", "image_assets", assets);

    setSaving(false);
    toast.success("Logo settings saved as draft");
  };

  const handlePublish = async () => {
    await handleSave();
    setSaving(true);
    await publishContent("images", "logo_settings");
    await publishContent("images", "logo_history");
    await publishContent("images", "image_assets");
    await publishContent("images", "favicon_url");
    setSaving(false);
    toast.success("Logo published! Changes are now live.");
  };

  // --- Crop logic ---
  const startCrop = () => {
    if (!settings.url) return;
    setTempImageUrl(settings.url);
    setZoom([1]);
    setOffsetX(0);
    setOffsetY(0);
    setCropMode(true);
  };

  const drawCropPreview = useCallback(() => {
    const canvas = cropCanvasRef.current;
    const img = cropImageRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = 240;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();
    const scale = zoom[0];
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const dx = (size - drawW) / 2 + offsetX;
    const dy = (size - drawH) / 2 + offsetY;
    ctx.drawImage(img, dx, dy, drawW, drawH);
    ctx.restore();
  }, [zoom, offsetX, offsetY]);

  useEffect(() => {
    if (cropMode && tempImageUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        cropImageRef.current = img;
        drawCropPreview();
      };
      img.src = tempImageUrl;
    }
  }, [cropMode, tempImageUrl, drawCropPreview]);

  const handleCropMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
  };

  const handleCropMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffsetX(e.clientX - dragStart.x);
    setOffsetY(e.clientY - dragStart.y);
  };

  const handleCropMouseUp = () => setDragging(false);

  useEffect(() => {
    if (cropMode) drawCropPreview();
  }, [cropMode, zoom, offsetX, offsetY, drawCropPreview]);

  const applyCrop = async () => {
    const canvas = cropCanvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setUploading(true);
      const file = new File([blob], `logo-cropped-${Date.now()}.png`, { type: "image/png" });
      const path = `logos/logo-cropped-${Date.now()}.png`;
      const url = await uploadCmsImage(file, path);
      if (url) {
        setSettings((prev) => ({ ...prev, url }));
        setLogoHistory((prev) => [url, ...prev.filter((u) => u !== url)].slice(0, 10));
        toast.success("Cropped logo applied");
      }
      setUploading(false);
      setCropMode(false);
    }, "image/png");
  };

  // Preview widths
  const deviceWidths: Record<PreviewDevice, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  const logoSrc = settings.url || defaultLogo;

  if (loading) return <div className="text-muted-foreground p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-heading text-lg font-semibold text-foreground">Brand Logo Settings</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
            <span className="ml-1.5">{previewMode ? "Edit" : "Preview"}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span className="ml-1.5">Save Draft</span>
          </Button>
          <Button variant="hero" size="sm" onClick={handlePublish} disabled={saving}>Publish</Button>
        </div>
      </div>

      {/* Crop Modal */}
      {cropMode && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setCropMode(false)}>
          <div className="bg-card rounded-2xl p-6 space-y-4 max-w-md w-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-heading font-semibold text-foreground">Crop Logo</h4>
            <p className="text-xs text-muted-foreground">Drag to reposition, use slider to zoom.</p>
            <div className="flex justify-center">
              <div
                className="relative w-60 h-60 rounded-full overflow-hidden border-2 border-primary cursor-move bg-muted/50"
                onMouseDown={handleCropMouseDown}
                onMouseMove={handleCropMouseMove}
                onMouseUp={handleCropMouseUp}
                onMouseLeave={handleCropMouseUp}
              >
                <canvas ref={cropCanvasRef} className="w-full h-full" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ZoomIn size={14} className="text-muted-foreground shrink-0" />
              <Slider
                value={zoom}
                onValueChange={(v) => setZoom(v)}
                min={0.3}
                max={3}
                step={0.05}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-10 text-right">{Math.round(zoom[0] * 100)}%</span>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setCropMode(false)}>Cancel</Button>
              <Button variant="hero" size="sm" onClick={applyCrop} disabled={uploading}>
                {uploading ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
                Apply Crop
              </Button>
            </div>
          </div>
        </div>
      )}

      {previewMode ? (
        /* --- Preview Panel --- */
        <div className="space-y-4">
          <div className="flex gap-2 justify-center">
            {(["desktop", "tablet", "mobile"] as PreviewDevice[]).map((device) => (
              <Button
                key={device}
                variant={previewDevice === device ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewDevice(device)}
                className="gap-1.5"
              >
                {device === "desktop" && <Monitor size={14} />}
                {device === "tablet" && <Tablet size={14} />}
                {device === "mobile" && <Smartphone size={14} />}
                <span className="capitalize">{device}</span>
              </Button>
            ))}
          </div>
          <div className="border border-border rounded-xl bg-muted/30 p-4 flex justify-center overflow-hidden">
            <div
              className="bg-background border border-border rounded-xl shadow-sm overflow-hidden transition-all duration-300"
              style={{ width: deviceWidths[previewDevice], maxWidth: "100%" }}
            >
              {/* Simulated navbar */}
              <div className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <img
                    src={logoSrc}
                    alt="Logo preview"
                    style={{
                      height: `${settings.height}px`,
                      width: `${settings.width}px`,
                      padding: `${settings.padding}px`,
                    }}
                    className="object-contain"
                  />
                  <span className="font-heading font-bold text-foreground text-sm sm:text-base">
                    {brandName}
                  </span>
                </div>
                <div className="flex gap-3">
                  {previewDevice !== "mobile" && (
                    <>
                      <span className="text-xs text-muted-foreground">Home</span>
                      <span className="text-xs text-muted-foreground">Services</span>
                      <span className="text-xs text-muted-foreground">Portfolio</span>
                      {previewDevice === "desktop" && (
                        <>
                          <span className="text-xs text-muted-foreground">Pricing</span>
                          <span className="text-xs text-muted-foreground">About</span>
                          <span className="text-xs text-muted-foreground">Contact</span>
                        </>
                      )}
                    </>
                  )}
                  {previewDevice === "mobile" && (
                    <div className="w-6 h-5 flex flex-col justify-center gap-1">
                      <div className="h-0.5 w-full bg-muted-foreground rounded" />
                      <div className="h-0.5 w-full bg-muted-foreground rounded" />
                      <div className="h-0.5 w-full bg-muted-foreground rounded" />
                    </div>
                  )}
                </div>
              </div>
              {/* Simulated footer */}
              <div className="flex items-center gap-2.5 px-4 sm:px-6 py-4 border-t border-border bg-muted/30">
                <img
                  src={logoSrc}
                  alt="Footer logo preview"
                  style={{
                    height: `${Math.round(settings.height * 0.8)}px`,
                    width: `${Math.round(settings.width * 0.8)}px`,
                    padding: `${settings.padding}px`,
                  }}
                  className="object-contain"
                />
                <span className="text-xs text-muted-foreground">{brandName}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- Edit Panel --- */
        <div className="space-y-5">
          {/* Current Logo */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h4 className="font-heading font-semibold text-foreground text-sm">Current Logo</h4>
            <div className="flex items-start gap-6">
              <div className="w-48 h-32 rounded-xl bg-muted/50 border border-border flex items-center justify-center overflow-hidden">
                {settings.url ? (
                  <img
                    src={settings.url}
                    alt="Current logo"
                    className="max-w-full max-h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon size={32} className="text-muted-foreground/30 mx-auto" />
                    <p className="text-xs text-muted-foreground mt-1">No logo uploaded</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                />
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {settings.url ? "Replace Logo" : "Upload Logo"}
                </Button>
                {settings.url && (
                  <>
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={startCrop}>
                      <ZoomIn size={14} />
                      Crop Logo
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-destructive" onClick={handleDelete}>
                      <Trash2 size={14} />
                      Remove Logo
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Size Controls */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-semibold text-foreground text-sm">Size & Padding</h4>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => update({ lockAspectRatio: !settings.lockAspectRatio })}
              >
                {settings.lockAspectRatio ? <Lock size={12} /> : <Unlock size={12} />}
                {settings.lockAspectRatio ? "Aspect Locked" : "Aspect Unlocked"}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Height (px)</label>
                <Input
                  type="number"
                  min={16}
                  max={120}
                  value={settings.height}
                  onChange={(e) => update({ height: Number(e.target.value) })}
                />
                <Slider
                  value={[settings.height]}
                  onValueChange={([v]) => update({ height: v })}
                  min={16}
                  max={120}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Width (px)</label>
                <Input
                  type="number"
                  min={16}
                  max={400}
                  value={settings.width}
                  onChange={(e) => update({ width: Number(e.target.value) })}
                />
                <Slider
                  value={[settings.width]}
                  onValueChange={([v]) => update({ width: v })}
                  min={16}
                  max={400}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Padding (px)</label>
                <Input
                  type="number"
                  min={0}
                  max={24}
                  value={settings.padding}
                  onChange={(e) => update({ padding: Number(e.target.value) })}
                />
                <Slider
                  value={[settings.padding]}
                  onValueChange={([v]) => update({ padding: v })}
                  min={0}
                  max={24}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Favicon Upload */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-primary" />
              <h4 className="font-heading font-semibold text-foreground text-sm">Browser Tab Icon (Favicon)</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a small square image (32×32 or 64×64 px recommended) that appears in the browser tab.
            </p>
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-xl bg-muted/50 border border-border flex items-center justify-center overflow-hidden">
                {faviconUrl ? (
                  <img src={faviconUrl} alt="Current favicon" className="max-w-full max-h-full object-contain p-2" />
                ) : (
                  <div className="text-center">
                    <Globe size={24} className="text-muted-foreground/30 mx-auto" />
                    <p className="text-[10px] text-muted-foreground mt-1">No favicon</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/png,image/x-icon,image/svg+xml,image/jpeg"
                  ref={faviconFileRef}
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFaviconUpload(e.target.files[0])}
                />
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => faviconFileRef.current?.click()} disabled={uploadingFavicon}>
                  {uploadingFavicon ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {faviconUrl ? "Replace Favicon" : "Upload Favicon"}
                </Button>
                {faviconUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-destructive"
                    onClick={() => {
                      setFaviconUrl("");
                      toast.info("Favicon removed. Save to apply.");
                    }}
                  >
                    <Trash2 size={14} />
                    Remove Favicon
                  </Button>
                )}
              </div>
            </div>
            {faviconUrl && (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg border border-border">
                <Globe size={12} className="text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground truncate">{faviconUrl.split("/").pop()}</span>
              </div>
            )}
          </div>

          {/* Logo History */}
          {logoHistory.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              <h4 className="font-heading font-semibold text-foreground text-sm">Previous Logos</h4>
              <p className="text-xs text-muted-foreground">Click to restore a previous logo.</p>
              <div className="flex gap-3 flex-wrap">
                {logoHistory.map((url, i) => (
                  <button
                    key={i}
                    className={`w-20 h-20 rounded-lg border-2 overflow-hidden flex items-center justify-center bg-muted/50 transition-all hover:scale-105 ${
                      url === settings.url ? "border-primary ring-2 ring-primary/20" : "border-border"
                    }`}
                    onClick={() => {
                      setSettings((prev) => ({ ...prev, url }));
                      toast.info("Logo restored. Save to apply.");
                    }}
                  >
                    <img src={url} alt={`Logo ${i + 1}`} className="max-w-full max-h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LogoEditor;
