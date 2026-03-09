import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp, Users, Globe, BarChart3, ArrowRight, CalendarDays, CheckCircle2 } from "lucide-react";
import { projectsData } from "@/data/projects";
import { usePublishedContent } from "@/hooks/usePublishedContent";

const caseStudySteps = [
  {
    icon: Users,
    title: "Client Challenge",
    desc: "Many businesses lack a professional online presence, losing customers to competitors who appear more credible with modern websites.",
  },
  {
    icon: Globe,
    title: "Our Solution",
    desc: "We design and build custom, mobile-optimized websites tailored to each business's brand, services, and target audience.",
  },
  {
    icon: TrendingUp,
    title: "Implementation",
    desc: "Through our 4-step process — consultation, planning, development, and launch — we deliver polished websites on schedule.",
  },
  {
    icon: BarChart3,
    title: "Results Achieved",
    desc: "Our clients consistently see increased customer reach, higher credibility, more online inquiries, and measurable business growth.",
  },
];

const results = [
  { value: "40%", label: "Average increase in customer inquiries" },
  { value: "60%", label: "Boost in online engagement" },
  { value: "3x", label: "More leads compared to social media only" },
  { value: "99%", label: "Client satisfaction rate" },
];

const Portfolio = () => {
  const { get } = usePublishedContent("portfolio");

  // Use CMS portfolio list if published, otherwise fall back to code data
  const cmsProjects: { title: string; description: string; image: string; type: string; slug: string }[] | null = get("portfolio_list", null);
  const projects = cmsProjects
    ? cmsProjects.map((cp) => {
        const codeMatch = projectsData.find((pd) => pd.slug === cp.slug);
        return codeMatch
          ? { ...codeMatch, title: cp.title, desc: cp.description || codeMatch.desc, img: cp.image || codeMatch.img, type: cp.type || codeMatch.type }
          : { title: cp.title, desc: cp.description, img: cp.image, type: cp.type, slug: cp.slug };
      })
    : projectsData;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Portfolio"
        description="Explore our portfolio of modern, professional websites built for businesses worldwide. See real results and case studies from Aperio Studios."
        path="/portfolio"
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
            🎨 Our Portfolio
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Websites That Drive Business Results
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Explore real projects we've delivered for businesses across Bangladesh. Each website is designed to attract customers, build credibility, and generate results.
          </motion.p>
        </div>
      </section>

      {/* Results Stats */}
      <section className="py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card max-w-4xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((r, i) => (
                <motion.div
                  key={r.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <p className="font-heading text-2xl sm:text-3xl font-bold text-primary">{r.value}</p>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1">{r.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {projects.map((p, i) => (
              <Link key={p.slug} to={`/portfolio/${p.slug}`} className="block">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group rounded-2xl border border-border bg-card overflow-hidden shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-300 h-full"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={p.img}
                      alt={`${p.title} website project`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {p.type}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-foreground mt-3 mb-1.5">{p.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{p.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                      View Case Study <ArrowRight size={14} />
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Process */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28 section-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-4"
          >
            How We Deliver Results
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-center max-w-2xl mx-auto mb-10 sm:mb-14"
          >
            Every project follows a structured approach designed to understand your business and deliver measurable outcomes.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {caseStudySteps.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card text-center hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
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
              Want a Website Like These?
            </h2>
            <p className="text-primary-foreground/80 text-base sm:text-lg mb-6 px-2 leading-relaxed">
              Schedule a free consultation and let us show you how a professional website can transform your business.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {["Free consultation", "Custom design", "On-time delivery"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary-foreground/90 font-medium">
                  <CheckCircle2 size={14} className="text-secondary" />
                  {item}
                </span>
              ))}
            </div>
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
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;
