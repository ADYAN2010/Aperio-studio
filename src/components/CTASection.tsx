import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight, CheckCircle2 } from "lucide-react";
import { usePublishedContent } from "@/hooks/usePublishedContent";

const CTASection = () => {
  const { get } = usePublishedContent("homepage");
  const ctaTitle = get("cta_title", "Ready to Grow Your Business Online?");
  const ctaDesc = get("cta_description", "Join 50+ businesses that have transformed their online presence with Aperio Studios. Schedule a free consultation today.");
  const ctaBtn1 = get("cta_button_1", "Book a Schedule");
  const ctaBtn2 = get("cta_button_2", "Contact Us");
  const ctaBadges: string[] = get("cta_badges", ["Free consultation", "Custom website plan", "No upfront commitment"]);

  return (
    <section className="py-14 sm:py-16 md:py-20 lg:py-28 bg-gradient-cta section-cta-blend relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-3 sm:mb-4">
            {ctaTitle}
          </h2>
          <p className="text-primary-foreground/80 text-base sm:text-lg mb-6 sm:mb-8 px-2 leading-relaxed">
            {ctaDesc}
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-8">
            {ctaBadges.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary-foreground/90 font-medium">
                <CheckCircle2 size={14} className="text-secondary" />
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold w-full sm:w-auto h-11 sm:h-12 gap-2 touch-manipulation" asChild>
              <a href="/book-meeting">
                <CalendarDays size={18} />
                {ctaBtn1}
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto h-11 sm:h-12 gap-2 touch-manipulation" asChild>
              <a href="/contact">
                {ctaBtn2}
                <ArrowRight size={16} />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
