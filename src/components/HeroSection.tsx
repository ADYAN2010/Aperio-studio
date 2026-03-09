import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight, CheckCircle2, Users, Globe, Award } from "lucide-react";
import heroMockup from "@/assets/hero-mockup.png";
import { usePublishedContent } from "@/hooks/usePublishedContent";

const iconMap: Record<string, any> = { Users, Globe, Award };

const defaultStats = [
  { icon: "Users", value: "50+", label: "Happy Clients" },
  { icon: "Globe", value: "80+", label: "Websites Built" },
  { icon: "Award", value: "99%", label: "Client Satisfaction" },
];

const defaultBadges = [
  "Mobile-Friendly Design",
  "SEO Optimized",
  "Fast Loading Speed",
  "24/7 Support",
];

const HeroSection = () => {
  const { get } = usePublishedContent("homepage");

  const headline = get("hero_headline", "Professional Websites That Help Your Business Grow");
  const description = get("hero_description", "Aperio Studios helps businesses build modern, high-performing websites that attract customers and strengthen their online presence. From consultation to launch, we handle everything.");
  const btn1Text = get("hero_button_1", "Book a Schedule");
  const btn2Text = get("hero_button_2", "View Our Portfolio");
  const trustBadges: string[] = get("features", defaultBadges);
  const heroBadge = get("hero_badge", "🚀 Creative Web Development Studio");
  const heroStats: typeof defaultStats = get("hero_stats", defaultStats);

  return (
    <section id="home" className="relative pt-28 sm:pt-32 md:pt-36 lg:pt-40 xl:pt-44 pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-gradient-hero section-blend-bottom overflow-hidden">
      <div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-secondary/30 text-secondary-foreground text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              {heroBadge}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-foreground leading-tight mb-4 sm:mb-6">
              {headline.includes("Business Grow") ? (
                <>
                  {headline.replace("Business Grow", "")}{" "}
                  <span className="text-gradient">Business Grow</span>
                </>
              ) : (
                headline
              )}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-5 sm:mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {description}
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start mb-6 sm:mb-8">
              {trustBadges.map((badge: string) => (
                <span key={badge} className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="w-full sm:w-auto text-sm sm:text-base px-5 sm:px-8 h-11 sm:h-12 gap-2" asChild>
                <a href="/book-meeting">
                  <CalendarDays size={18} />
                  {btn1Text}
                </a>
              </Button>
              <Button variant="heroOutline" size="lg" className="w-full sm:w-auto text-sm sm:text-base px-5 sm:px-8 h-11 sm:h-12 gap-2" asChild>
                <a href="/portfolio">
                  {btn2Text}
                  <ArrowRight size={16} />
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center mt-4 lg:mt-0"
          >
            <img
              src={heroMockup}
              alt="Modern business website dashboard mockup showing professional web design"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl animate-float"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 sm:mt-16 lg:mt-20"
        >
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-card">
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              {heroStats.map((stat) => {
                const Icon = iconMap[stat.icon] || Users;
                return (
                  <div key={stat.label} className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <Icon size={20} className="text-primary sm:w-6 sm:h-6" />
                    </div>
                    <p className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
