// Footer component
import { forwardRef } from "react";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Globe } from "lucide-react";
import defaultLogo from "@/assets/aperio-logo.png";
import { usePublishedContent } from "@/hooks/usePublishedContent";

const iconMap: Record<string, any> = {
  Facebook,
  Twitter,
  LinkedIn: Linkedin,
  Linkedin,
  Instagram,
};

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const { get } = usePublishedContent("navigation");
  const { get: getImages } = usePublishedContent("images");
  
  // CMS logo
  const cmsImages: { label: string; url: string; key: string }[] | null = getImages("image_assets", null);
  const cmsLogo = cmsImages?.find((img) => img.key === "site-logo" || img.label.toLowerCase().includes("logo"))?.url;
  const logoSrc = cmsLogo || defaultLogo;
  const logoSettings = getImages("logo_settings", null) as { height?: number; width?: number; padding?: number } | null;
  const brandName = get("brand_name", "Aperio Studios");

  const desc = get("footer_description", "Helping businesses build professional websites and grow their online presence.");
  const email = get("footer_email", "hello@aperiostudios.com");
  const phone = get("footer_phone", "+880 1XXX-XXXXXX");
  const address = get("footer_address", "Dhaka, Bangladesh");
  const socialLinks: { platform: string; url: string }[] = get("social_links", [
    { platform: "Facebook", url: "#" },
    { platform: "Twitter", url: "#" },
    { platform: "LinkedIn", url: "#" },
    { platform: "Instagram", url: "#" },
  ]);
  const footerLinks: { label: string; href: string }[] = get("footer_links", [
    { label: "About Us", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ]);

  return (
    <footer ref={ref} className="bg-footer py-10 sm:py-12 md:py-16 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
          {/* Col 1 */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="mb-3 sm:mb-4">
              <a href="/" className="flex items-center gap-2.5">
                <img
                  src={logoSrc}
                  alt={`${brandName} logo`}
                  className={logoSettings?.height ? "w-auto object-contain" : "h-8 sm:h-10 w-auto object-contain"}
                  style={logoSettings?.height ? {
                    height: `${Math.round(logoSettings.height * 0.85)}px`,
                    width: logoSettings.width ? `${Math.round(logoSettings.width * 0.85)}px` : 'auto',
                    padding: logoSettings.padding ? `${logoSettings.padding}px` : undefined,
                  } : undefined}
                  loading="lazy"
                  decoding="async"
                />
                <span className="font-heading font-bold text-footer-foreground text-base sm:text-lg tracking-tight">
                  {brandName}
                </span>
              </a>
            </div>
            <p className="text-footer-muted text-xs sm:text-sm max-w-xs mb-4">
              {desc}
            </p>
            <div className="space-y-2 mb-4">
              <a href={`mailto:${email}`} className="flex items-center gap-2 text-footer-muted hover:text-footer-foreground text-xs sm:text-sm transition-colors">
                <Mail size={13} /> {email}
              </a>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-footer-muted hover:text-footer-foreground text-xs sm:text-sm transition-colors">
                <Phone size={13} /> {phone}
              </a>
              <span className="flex items-center gap-2 text-footer-muted text-xs sm:text-sm">
                <MapPin size={13} /> {address}
              </span>
            </div>
            <div className="flex gap-2.5 sm:gap-3">
              {socialLinks.map((social, i) => {
                const Icon = iconMap[social.platform] || Globe;
                return (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-footer-foreground/10 hover:bg-primary/60 flex items-center justify-center transition-colors touch-manipulation"
                  >
                    <Icon size={14} className="text-footer-muted sm:w-4 sm:h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-heading font-semibold text-footer-foreground mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {footerLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-footer-muted hover:text-footer-foreground text-xs sm:text-sm transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-heading font-semibold text-footer-foreground mb-3 sm:mb-4 text-sm sm:text-base">Services</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { label: "Business Websites", href: "/services/business-website-development" },
                { label: "E-commerce", href: "/services/ecommerce-website-development" },
                { label: "Corporate Sites", href: "/services/corporate-company-websites" },
                { label: "Startup Pages", href: "/services/startup-landing-pages" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-footer-muted hover:text-footer-foreground text-xs sm:text-sm transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-heading font-semibold text-footer-foreground mb-3 sm:mb-4 text-sm sm:text-base">Get Started</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { label: "Book a Meeting", href: "/book-meeting" },
                { label: "Login", href: "/login" },
                { label: "Sign Up", href: "/signup" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-footer-muted hover:text-footer-foreground text-xs sm:text-sm transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-footer-foreground/10 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-footer-muted text-xs sm:text-sm">
            © 2023 {brandName}. All rights reserved.
          </p>
          <p className="text-footer-muted/70 text-xs">
            Professional website development and design
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
