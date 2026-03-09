import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Send, Mail, Phone, CalendarDays } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePublishedContent } from "@/hooks/usePublishedContent";

const ContactSection = forwardRef<HTMLElement>((_, ref) => {
  const { get } = usePublishedContent("contact");
  const contactEmail = get("email", "hello@aperiostudios.com");
  const contactPhone = get("phone", "+880 1XXX-XXXXXX");
  const contactWhatsapp = get("whatsapp", "https://wa.me/8801XXXXXXXXX");

  const { get: getHomepage } = usePublishedContent("homepage");
  const sectionBadge = getHomepage("contact_badge", "📬 Get in Touch");
  const sectionTitle = getHomepage("contact_title", "Let's Talk About Your Project");
  const sectionDesc = getHomepage("contact_description", "Have questions? Send us a message or schedule a meeting. We typically respond within 24 hours.");

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });
    setSubmitting(false);
    if (error) { toast.error("Something went wrong."); return; }
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section ref={ref} id="contact" className="py-14 sm:py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-secondary/30 text-secondary-foreground text-xs sm:text-sm font-medium mb-4">
            {sectionBadge}
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            {sectionTitle}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {sectionDesc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-5"
          >
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 shadow-card">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <CalendarDays size={22} className="text-primary" />
              </div>
              <h3 className="font-heading font-bold text-foreground mb-2">Prefer a Meeting?</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Schedule a free consultation to discuss your website project in detail.
              </p>
              <Button variant="hero" size="sm" className="gap-2" asChild>
                <a href="/book-meeting">
                  <CalendarDays size={14} />
                  Book a Schedule
                </a>
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { icon: null, customIcon: <WhatsAppIcon size={18} className="text-[hsl(142,70%,45%)]" />, label: "WhatsApp", value: "Chat on WhatsApp", href: contactWhatsapp, bg: "bg-[hsl(142,70%,45%)]/10", bgHover: "group-hover:bg-[hsl(142,70%,45%)]/20" },
                { icon: Mail, customIcon: null, label: "Email", value: contactEmail, href: `mailto:${contactEmail}`, bg: "bg-primary/10", bgHover: "group-hover:bg-primary/20" },
                { icon: Phone, customIcon: null, label: "Phone", value: contactPhone, href: `tel:${contactPhone.replace(/\s/g, "")}`, bg: "bg-primary/10", bgHover: "group-hover:bg-primary/20" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-card transition-all duration-200 group"
                >
                  <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center shrink-0 ${item.bgHover} transition-colors`}>
                    {item.customIcon ? item.customIcon : item.icon && <item.icon size={18} className="text-primary" />}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Name <span className="text-destructive">*</span></label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required maxLength={100} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition touch-manipulation" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email <span className="text-destructive">*</span></label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required maxLength={255} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition touch-manipulation" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Message <span className="text-destructive">*</span></label>
              <textarea name="message" value={form.message} onChange={handleChange} required maxLength={2000} rows={5} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none touch-manipulation" placeholder="Tell us about your business and website needs..." />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full sm:w-auto gap-2 touch-manipulation" disabled={submitting}>
              <Send size={16} />
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
});

ContactSection.displayName = "ContactSection";

export default ContactSection;
