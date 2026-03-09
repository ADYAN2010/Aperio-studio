import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Layout,
  Paintbrush,
  Rocket,
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";
import { servicesData } from "@/data/services";
import { usePublishedContent } from "@/hooks/usePublishedContent";

const steps = [
  { icon: MessageSquare, title: "Consultation", desc: "We understand your business goals and website requirements" },
  { icon: Layout, title: "Planning", desc: "We create a tailored plan with sitemap, features, and timeline" },
  { icon: Paintbrush, title: "Development", desc: "We design and build your website with modern technologies" },
  { icon: Rocket, title: "Launch", desc: "We deploy your website and provide ongoing support" },
];

const whyUs = [
  { icon: Users, title: "50+ Happy Clients", desc: "Trusted by businesses across Bangladesh" },
  { icon: TrendingUp, title: "Proven Results", desc: "Our clients see measurable growth in online presence" },
  { icon: Shield, title: "Reliable Support", desc: "Dedicated support team available when you need help" },
  { icon: CalendarDays, title: "On-Time Delivery", desc: "We deliver projects within the agreed timeline" },
];

const Services = () => {
  const { get } = usePublishedContent("services");
  
  // Use CMS services list if published, otherwise fall back to code data
  const cmsServices: { title: string; description: string; image: string; slug: string }[] | null = get("services_list", null);
  const displayServices = cmsServices
    ? cmsServices.map((cs) => {
        // Merge CMS data with code data to keep icons and extra fields
        const codeMatch = servicesData.find((sd) => sd.slug === cs.slug);
        return codeMatch
          ? { ...codeMatch, title: cs.title, desc: cs.description || codeMatch.desc, image: cs.image || codeMatch.image }
          : { ...cs, desc: cs.description, icon: ArrowRight, bestFor: "", slug: cs.slug };
      })
    : servicesData;
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Services"
        description="Professional web development services including business websites, e-commerce, corporate sites, startup landing pages, and portfolio websites by Aperio Studios."
        path="/services"
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
            💼 Professional Web Services
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Website Development Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            From business websites to e-commerce platforms, we build premium digital experiences tailored to your industry and audience.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Button variant="hero" size="lg" className="gap-2" asChild>
              <Link to="/book-meeting">
                <CalendarDays size={18} />
                Book a Schedule
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {displayServices.map((s, i) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-card shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-300 h-full flex flex-col overflow-hidden"
                >
                  {/* 3D Image */}
                  <div className="relative h-48 sm:h-52 bg-muted/30 flex items-center justify-center p-5 overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <s.icon size={22} className="text-primary" />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-foreground">{s.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{s.desc}</p>
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">Best for:</span> {s.bestFor}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                      Learn More <ArrowRight size={14} />
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28 section-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-4"
          >
            Why Choose Aperio Studios?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-center max-w-2xl mx-auto mb-10 sm:mb-14"
          >
            We combine quality, affordability, and reliability to deliver websites that truly help your business succeed.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {whyUs.map((item, i) => (
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
                <h3 className="font-heading font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-10 sm:mb-14"
          >
            How Our Process Works
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
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
              Ready to Build Your Business Website?
            </h2>
            <p className="text-primary-foreground/80 text-base sm:text-lg mb-6 sm:mb-8 px-2 leading-relaxed">
              Schedule a free consultation to discuss your project and get a customized plan tailored to your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold h-11 sm:h-12 gap-2 touch-manipulation"
                asChild
              >
                <Link to="/book-meeting">
                  <CalendarDays size={18} />
                  Book a Schedule
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 h-11 sm:h-12 touch-manipulation"
                asChild
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
