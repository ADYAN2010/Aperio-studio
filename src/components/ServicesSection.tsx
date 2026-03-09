import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { servicesData } from "@/data/services";
import { usePublishedContent } from "@/hooks/usePublishedContent";

const ServicesSection = () => {
  const { get } = usePublishedContent("homepage");
  const sectionBadge = get("services_badge", "💼 What We Build");
  const sectionTitle = get("services_title", "Professional Web Solutions for Every Business");
  const sectionDesc = get("services_description", "From business websites to full e-commerce platforms, we build digital experiences that convert visitors into customers.");
  const btnText = get("services_button", "View All Services");

  const { get: getServices } = usePublishedContent("services");
  const cmsServices: { title: string; description: string; image: string; slug: string }[] | null = getServices("services_list", null);
  const displayServices = cmsServices
    ? cmsServices.map((cs) => {
        const codeMatch = servicesData.find((sd) => sd.slug === cs.slug);
        return codeMatch
          ? { ...codeMatch, title: cs.title, desc: cs.description || codeMatch.desc, image: cs.image || codeMatch.image }
          : { ...cs, desc: cs.description, icon: ArrowRight, slug: cs.slug, image: cs.image };
      })
    : servicesData;

  return (
    <section id="services" className="py-14 sm:py-16 md:py-20 lg:py-28 section-soft">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {displayServices.map((s, i) => (
            <Link key={s.slug} to={`/services/${s.slug}`} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-300 overflow-hidden h-full flex flex-col"
              >
                <div className="relative h-44 sm:h-48 bg-muted/30 flex items-center justify-center p-4 overflow-hidden">
                  <img src={s.image} alt={s.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {"icon" in s && s.icon && (
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <s.icon size={20} className="text-primary" />
                      </div>
                    )}
                    <h3 className="font-heading text-lg font-bold text-foreground">{s.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{s.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                    Learn More <ArrowRight size={14} />
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-14"
        >
          <Button variant="hero" size="lg" className="gap-2" asChild>
            <Link to="/services">
              {btnText}
              <ArrowRight size={16} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
