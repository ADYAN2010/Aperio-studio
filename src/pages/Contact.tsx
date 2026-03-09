import { useState } from "react";
import Navbar from "@/components/Navbar";
import { usePublishedContent } from "@/hooks/usePublishedContent";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import {
  Mail,
  Phone,
  MapPin,
  ClipboardList,
  Lightbulb,
  Paintbrush,
  Shield,
  Smartphone,
  HeadphonesIcon,
  Check,
  CalendarDays,
  Send,
  Clock,
  CheckCircle2,
} from "lucide-react";

// Contact options are built dynamically in the component using CMS values

const websiteTypes = [
  "Business Website",
  "E-commerce Website",
  "Portfolio Website",
  "Website Redesign",
  "Custom Solution",
];

const processSteps = [
  { icon: ClipboardList, title: "We Review Your Request", desc: "Our team reviews your message and understands your business needs within 24 hours." },
  { icon: Lightbulb, title: "We Suggest Solutions", desc: "We recommend the best website solution based on your goals, budget, and timeline." },
  { icon: Paintbrush, title: "We Start Building", desc: "Once approved, we begin designing and developing your professional website." },
];

const trustPoints = [
  { icon: Shield, text: "Professional modern websites" },
  { icon: Smartphone, text: "Mobile-friendly responsive design" },
  { icon: Check, text: "Affordable solutions for every budget" },
  { icon: HeadphonesIcon, text: "Dedicated ongoing client support" },
  { icon: Clock, text: "Response within 24 hours" },
  { icon: CheckCircle2, text: "50+ satisfied clients" },
];

const Contact = () => {
  const { get } = usePublishedContent("contact");
  const contactHeadline = get("headline", "Let's Build Your Business Website");
  const contactDescription = get("description", "Ready to grow your business online? Get in touch with Aperio Studios through any of the methods below. We respond within 24 hours.");
  const contactEmail = get("email", "hello@aperiostudios.com");
  const contactPhone = get("phone", "+880 1XXX-XXXXXX");
  const contactWhatsapp = get("whatsapp", "https://wa.me/8801XXXXXXXXX");
  const contactLocation = get("location", "Dhaka, Bangladesh");

  const contactOptions = [
    {
      icon: CalendarDays,
      customIcon: null,
      title: "Book a Meeting",
      desc: "Schedule a free consultation to discuss your website project in detail.",
      info: "Free 30-min call",
      action: "Book a Schedule",
      href: "/book-meeting",
      primary: true,
      color: "text-primary",
      bg: "bg-primary/10",
      bgHover: "bg-primary/20",
    },
    {
      icon: null,
      customIcon: <WhatsAppIcon size={22} className="text-[hsl(142,70%,45%)]" />,
      title: "WhatsApp Chat",
      desc: "Chat with us directly for quick questions and instant responses.",
      info: "Typically replies in minutes",
      action: "Chat Now",
      href: contactWhatsapp,
      primary: false,
      color: "text-[hsl(142,70%,45%)]",
      bg: "bg-[hsl(142,70%,45%)]/10",
      bgHover: "bg-[hsl(142,70%,45%)]/20",
    },
    {
      icon: Mail,
      customIcon: null,
      title: "Email Support",
      desc: "Send us your detailed business requirements and project brief.",
      info: contactEmail,
      action: "Send Email",
      href: `mailto:${contactEmail}`,
      primary: false,
      color: "text-primary",
      bg: "bg-primary/10",
      bgHover: "bg-primary/20",
    },
    {
      icon: Phone,
      customIcon: null,
      title: "Call Us",
      desc: "Speak directly with our team for immediate assistance.",
      info: contactPhone,
      action: "Call Now",
      href: `tel:${contactPhone.replace(/\s/g, "")}`,
      primary: false,
      color: "text-primary",
      bg: "bg-primary/10",
      bgHover: "bg-primary/20",
    },
  ];

  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    phone: "",
    websiteType: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedMessage = form.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (trimmedName.length > 100 || trimmedEmail.length > 255 || trimmedMessage.length > 2000) {
      toast.error("One or more fields exceed the maximum length.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("messages").insert({
      name: trimmedName,
      business_name: form.businessName.trim() || null,
      email: trimmedEmail,
      phone: form.phone.trim() || null,
      website_type: form.websiteType || null,
      message: trimmedMessage,
    });

    setSubmitting(false);

    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    toast.success("Thank you! We will contact you within 24 hours.");
    setForm({ name: "", businessName: "", email: "", phone: "", websiteType: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact Us"
        description="Get in touch with Aperio Studios. Book a consultation, send a message, or chat with us to discuss your website project."
        path="/contact"
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-36 sm:pt-40 md:pt-44 lg:pt-48 pb-14 sm:pb-16 md:pb-20 bg-gradient-hero section-blend-bottom">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 rounded-full bg-secondary/30 text-secondary-foreground text-xs sm:text-sm font-medium mb-4"
          >
            📬 Contact Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            {contactHeadline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {contactDescription}
          </motion.p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-10 sm:mb-14"
          >
            Choose How to Reach Us
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {contactOptions.map((opt, i) => (
              <motion.div
                key={opt.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-2xl border p-6 shadow-card text-center hover:shadow-card-hover transition-all duration-300 ${
                  opt.primary
                    ? "border-primary bg-primary/[0.03] shadow-hero"
                    : "border-border bg-card"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors ${opt.bg}`}
                >
                  {opt.customIcon ? opt.customIcon : opt.icon && <opt.icon size={24} className={opt.color} />}
                </div>
                <h3 className="font-heading font-bold text-foreground mb-1">{opt.title}</h3>
                <p className="text-muted-foreground text-sm mb-2 leading-relaxed">{opt.desc}</p>
                <p className="text-xs font-medium text-muted-foreground mb-4 truncate">{opt.info}</p>
                <Button
                  variant={opt.primary ? "hero" : "heroOutline"}
                  size="sm"
                  className="touch-manipulation"
                  asChild
                >
                  <a href={opt.href} target={opt.href.startsWith("http") ? "_blank" : undefined} rel={opt.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                    {opt.action}
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28 section-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-4"
            >
              Send Us a Message
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-center mb-10 sm:mb-14 max-w-xl mx-auto"
            >
              Fill out the form below and we'll get back to you within 24 hours with a personalized response.
            </motion.p>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    maxLength={100}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition touch-manipulation"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    maxLength={100}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition touch-manipulation"
                    placeholder="Your business name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    maxLength={255}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition touch-manipulation"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={20}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition touch-manipulation"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Type of Website Needed
                </label>
                <select
                  name="websiteType"
                  value={form.websiteType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition touch-manipulation"
                >
                  <option value="">Select a website type</option>
                  {websiteTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  maxLength={2000}
                  required
                  rows={5}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none touch-manipulation"
                  placeholder="Tell us about your business and what kind of website you need..."
                />
              </div>
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full sm:w-auto gap-2 touch-manipulation"
                disabled={submitting}
              >
                <Send size={16} />
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-4"
          >
            What Happens After You Contact Us?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-center max-w-2xl mx-auto mb-10 sm:mb-14"
          >
            We follow a clear process to ensure you get the best possible experience and results.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  Step {i + 1}
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card pt-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28 section-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-10 sm:mb-14"
          >
            Why Businesses Trust Aperio Studios
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {trustPoints.map((tp, i) => (
              <motion.div
                key={tp.text}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card shadow-card"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <tp.icon size={18} className="text-primary" />
                </div>
                <p className="font-heading font-semibold text-foreground text-sm">{tp.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-14 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-border shadow-card">
            <iframe
              title="Aperio Studios Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2784!2d90.3994!3d23.7461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ0JzQ2LjAiTiA5MMKwMjMnNTcuOCJF!5e0!3m2!1sen!2sbd!4v1700000000000"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28 bg-gradient-cta section-cta-blend relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-3 sm:mb-4">
              Start Your Online Journey Today
            </h2>
            <p className="text-primary-foreground/80 text-base sm:text-lg mb-6 sm:mb-8 px-2 leading-relaxed">
              Schedule a free consultation and discover how a professional website can transform your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold h-11 sm:h-12 gap-2 touch-manipulation"
                asChild
              >
                <a href="/book-meeting">
                  <CalendarDays size={18} />
                  Book a Schedule
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 h-11 sm:h-12 touch-manipulation"
                asChild
              >
                <a href="/portfolio">View Portfolio</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
