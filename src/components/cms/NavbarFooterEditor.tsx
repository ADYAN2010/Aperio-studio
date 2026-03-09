import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Save, Loader2, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const NavbarFooterEditor = () => {
  const { loading, upsertContent, publishContent, getContent } = useSiteContent("navigation");
  const [navItems, setNavItems] = useState<{ label: string; href: string }[]>([]);
  const [brandName, setBrandName] = useState("Aperio Studios");
  const [footerDesc, setFooterDesc] = useState("");
  const [footerEmail, setFooterEmail] = useState("");
  const [footerPhone, setFooterPhone] = useState("");
  const [footerAddress, setFooterAddress] = useState("");
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);
  const [footerLinks, setFooterLinks] = useState<{ label: string; href: string }[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  if (!loading && !initialized) {
    setNavItems(getContent("nav_items") || [
      { label: "Home", href: "/#home" },
      { label: "Services", href: "/services" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Pricing", href: "/pricing" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ]);
    setBrandName(getContent("brand_name") || "Aperio Studios");
    setFooterDesc(getContent("footer_description") || "Helping businesses build professional websites and grow their online presence.");
    setFooterEmail(getContent("footer_email") || "hello@aperiostudios.com");
    setFooterPhone(getContent("footer_phone") || "+880 1XXX-XXXXXX");
    setFooterAddress(getContent("footer_address") || "Dhaka, Bangladesh");
    setSocialLinks(getContent("social_links") || [
      { platform: "Facebook", url: "#" },
      { platform: "Twitter", url: "#" },
      { platform: "LinkedIn", url: "#" },
      { platform: "Instagram", url: "#" },
    ]);
    setFooterLinks(getContent("footer_links") || [
      { label: "About Us", href: "/about" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ]);
    setInitialized(true);
  }

  const handleSave = async () => {
    setSaving(true);
    await upsertContent("navigation", "nav_items", navItems);
    await upsertContent("navigation", "brand_name", brandName);
    await upsertContent("navigation", "footer_description", footerDesc);
    await upsertContent("navigation", "footer_email", footerEmail);
    await upsertContent("navigation", "footer_phone", footerPhone);
    await upsertContent("navigation", "footer_address", footerAddress);
    await upsertContent("navigation", "social_links", socialLinks);
    await upsertContent("navigation", "footer_links", footerLinks);
    setSaving(false);
    toast.success("Navigation & footer saved as draft");
  };

  const handlePublish = async () => {
    await handleSave();
    setSaving(true);
    for (const key of ["nav_items", "brand_name", "footer_description", "footer_email", "footer_phone", "footer_address", "social_links", "footer_links"]) {
      await publishContent("navigation", key);
    }
    setSaving(false);
    toast.success("Navigation & footer published!");
  };

  if (loading) return <div className="text-muted-foreground p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-heading text-lg font-semibold text-foreground">Navigation & Footer</h3>
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
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Navbar Preview</h4>
          <div className="bg-card rounded-xl p-4 shadow-card flex items-center gap-4 flex-wrap">
            <img src="/placeholder.svg" alt="Logo" className="h-8 w-auto" />
            <span className="font-heading font-bold text-foreground">{brandName}</span>
            <div className="flex gap-3 flex-wrap">
              {navItems.map((item, i) => (
                <span key={i} className="text-sm text-muted-foreground">{item.label}</span>
              ))}
            </div>
          </div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-4">Footer Preview</h4>
          <div className="bg-footer rounded-xl p-5 text-footer-foreground">
            <p className="text-sm text-footer-muted">{footerDesc}</p>
            <p className="text-sm mt-2">✉ {footerEmail}</p>
            <p className="text-sm">📞 {footerPhone}</p>
            <p className="text-sm">📍 {footerAddress}</p>
            <div className="flex gap-2 mt-3">
              {socialLinks.map((s, i) => (
                <span key={i} className="text-xs bg-footer-foreground/10 px-2 py-1 rounded">{s.platform}</span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h4 className="font-heading font-semibold text-foreground text-sm">Brand Name</h4>
            <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Aperio Studios" />
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h4 className="font-heading font-semibold text-foreground text-sm">Navbar Menu Items ({navItems.length})</h4>
            {navItems.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input value={item.label} onChange={(e) => { const u = [...navItems]; u[i].label = e.target.value; setNavItems(u); }} placeholder="Label" />
                <Input value={item.href} onChange={(e) => { const u = [...navItems]; u[i].href = e.target.value; setNavItems(u); }} placeholder="Link (e.g. /services)" />
                <Button variant="ghost" size="sm" className="text-destructive shrink-0" onClick={() => setNavItems(navItems.filter((_, j) => j !== i))}>
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setNavItems([...navItems, { label: "", href: "" }])}>
              <Plus size={14} className="mr-1" /> Add Link
            </Button>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h4 className="font-heading font-semibold text-foreground text-sm">Footer Content</h4>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Company Description</label>
              <Textarea value={footerDesc} onChange={(e) => setFooterDesc(e.target.value)} rows={2} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
                <Input value={footerEmail} onChange={(e) => setFooterEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone</label>
                <Input value={footerPhone} onChange={(e) => setFooterPhone(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Address</label>
                <Input value={footerAddress} onChange={(e) => setFooterAddress(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h4 className="font-heading font-semibold text-foreground text-sm">Social Media Links</h4>
            {socialLinks.map((link, i) => (
              <div key={i} className="flex gap-2">
                <Input value={link.platform} onChange={(e) => { const u = [...socialLinks]; u[i].platform = e.target.value; setSocialLinks(u); }} placeholder="Platform" />
                <Input value={link.url} onChange={(e) => { const u = [...socialLinks]; u[i].url = e.target.value; setSocialLinks(u); }} placeholder="URL" />
                <Button variant="ghost" size="sm" className="text-destructive shrink-0" onClick={() => setSocialLinks(socialLinks.filter((_, j) => j !== i))}>
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setSocialLinks([...socialLinks, { platform: "", url: "" }])}>
              <Plus size={14} className="mr-1" /> Add Social Link
            </Button>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <h4 className="font-heading font-semibold text-foreground text-sm">Footer Quick Links</h4>
            {footerLinks.map((link, i) => (
              <div key={i} className="flex gap-2">
                <Input value={link.label} onChange={(e) => { const u = [...footerLinks]; u[i].label = e.target.value; setFooterLinks(u); }} placeholder="Label" />
                <Input value={link.href} onChange={(e) => { const u = [...footerLinks]; u[i].href = e.target.value; setFooterLinks(u); }} placeholder="Link" />
                <Button variant="ghost" size="sm" className="text-destructive shrink-0" onClick={() => setFooterLinks(footerLinks.filter((_, j) => j !== i))}>
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setFooterLinks([...footerLinks, { label: "", href: "" }])}>
              <Plus size={14} className="mr-1" /> Add Link
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarFooterEditor;
