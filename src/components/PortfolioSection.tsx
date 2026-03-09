import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { usePublishedContent } from "@/hooks/usePublishedContent";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";

const defaultProjects = [
  { img: portfolio1, name: "Ahmed Textiles", type: "Business Website", desc: "A professional website for a textile business, featuring product catalogs and inquiry forms that increased customer leads by 40%." },
  { img: portfolio2, name: "Sabrina's Kitchen", type: "Restaurant Website", desc: "A modern restaurant website with online menu, reservation system, and social media integration that boosted online orders by 60%." },
  { img: portfolio3, name: "Hasan Electronics", type: "E-commerce Store", desc: "A full e-commerce store with product management, secure payments, and order tracking that expanded the business beyond Sylhet." },
];

const PortfolioSection = () => {
  const { get } = usePublishedContent("homepage");
  const sectionBadge = get("portfolio_badge", "🎨 Our Work");
  const sectionTitle = get("portfolio_title", "Websites That Drive Real Business Results");
  const sectionDesc = get("portfolio_description", "Browse our portfolio of websites built for businesses across Bangladesh. Each project is designed to attract customers and grow revenue.");
  const btnText = get("portfolio_button", "View Full Portfolio");

  const { get: getPortfolio } = usePublishedContent("portfolio");
  const cmsProjects: { title: string; description: string; image: string; type: string }[] | null = getPortfolio("portfolio_list", null);
  const projects = cmsProjects
    ? cmsProjects.slice(0, 3).map((p) => ({ img: p.image, name: p.title, type: p.type, desc: p.description }))
    : defaultProjects;

  return (
    <section id="portfolio" className="py-14 sm:py-16 md:py-20 lg:py-28 bg-background">
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
          {projects.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-2xl overflow-hidden border border-border bg-card shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-video">
                <img src={p.img} alt={`${p.name} website project`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300 flex items-center justify-center">
                  <ExternalLink className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={28} />
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">{p.type}</span>
                <h3 className="font-heading text-lg font-bold text-foreground mt-3 mb-2">{p.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-14"
        >
          <Button variant="heroOutline" size="lg" className="gap-2" asChild>
            <a href="/portfolio">
              {btnText}
              <ArrowRight size={16} />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;
