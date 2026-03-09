import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CalendarDays, MessageSquare, FileText, Paintbrush, Rocket, CheckCircle2 } from "lucide-react";
import { usePublishedContent } from "@/hooks/usePublishedContent";

const iconMap: Record<string, any> = { MessageSquare, FileText, Paintbrush, Rocket };

const defaultSteps = [
  { icon: "MessageSquare", step: "01", title: "Business Consultation", desc: "We start by understanding your business, target audience, and website goals through a detailed consultation." },
  { icon: "FileText", step: "02", title: "Website Planning", desc: "Our team creates a tailored plan including sitemap, features, and design direction based on your requirements." },
  { icon: "Paintbrush", step: "03", title: "Design & Development", desc: "We design and build your website with modern UI, responsive layout, and optimized performance." },
  { icon: "Rocket", step: "04", title: "Launch & Support", desc: "We launch your website and provide ongoing support, maintenance, and guidance to help you grow." },
];

const ConsultationSection = () => {
  const { get } = usePublishedContent("homepage");
  const sectionBadge = get("process_badge", "📋 Our Process");
  const sectionTitle = get("process_title", "From Consultation to Launch in 4 Simple Steps");
  const sectionDesc = get("process_description", "We follow a proven process to ensure your website is built right. Every project starts with understanding your business needs.");
  const processSteps: typeof defaultSteps = get("process_steps", defaultSteps);
  const ctaTitle = get("process_cta_title", "Ready to Get Started?");
  const ctaDesc = get("process_cta_description", "Book a consultation with Aperio Studios to discuss your business goals, website requirements, and how we can help you grow online.");
  const ctaBadges: string[] = get("process_cta_badges", ["Free consultation", "No obligation", "Personalized plan"]);

  return (
    <section id="consultation" className="py-14 sm:py-16 md:py-20 lg:py-28 section-soft">
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
            {sectionTitle.includes("4 Simple Steps") ? (
              <>
                {sectionTitle.replace("4 Simple Steps", "")}<span className="text-gradient">4 Simple Steps</span>
              </>
            ) : sectionTitle}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {sectionDesc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16">
          {processSteps.map((step, i) => {
            const Icon = iconMap[step.icon] || MessageSquare;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-card hover:shadow-card-hover transition-all duration-300 text-center"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  Step {step.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 mt-2">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 sm:p-8 lg:p-10 shadow-card text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CalendarDays size={24} className="text-primary" />
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-3">
              {ctaTitle}
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base mb-4 max-w-lg mx-auto leading-relaxed">
              {ctaDesc}
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {ctaBadges.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-foreground font-medium">
                  <CheckCircle2 size={14} className="text-primary" />
                  {item}
                </span>
              ))}
            </div>
            <Button variant="hero" size="lg" className="gap-2" asChild>
              <a href="/book-meeting">
                <CalendarDays size={18} />
                Book a Schedule
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConsultationSection;
