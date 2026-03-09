import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, ChevronRight, Home, ArrowRight } from "lucide-react";
import { servicesData } from "@/data/services";
import NotFound from "./NotFound";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = servicesData.find((s) => s.slug === slug);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  if (!service) return <NotFound />;

  const Icon = service.icon;
  const otherServices = servicesData.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={service.title}
        description={service.desc}
        path={`/services/${service.slug}`}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-36 sm:pt-40 md:pt-44 lg:pt-48 pb-14 sm:pb-16 md:pb-20 bg-gradient-hero section-blend-bottom">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm flex-wrap">
              <li>
                <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                  <Home size={14} />
                  Home
                </Link>
              </li>
              <li><ChevronRight size={14} className="text-muted-foreground/50" /></li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li><ChevronRight size={14} className="text-muted-foreground/50" /></li>
              <li>
                <span className="text-foreground font-medium">{service.title}</span>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon size={24} className="text-primary" />
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary/30 text-secondary-foreground">
                  {service.bestFor}
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
              >
                {service.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed mb-6"
              >
                {service.longDesc}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Button variant="hero" size="lg" className="gap-2" asChild>
                  <Link to="/book-meeting">Get Started</Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full max-w-md lg:max-w-lg object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card"
            >
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-6">
                What's Included
              </h2>
              <ul className="space-y-3">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-foreground text-sm sm:text-base">
                    <Check size={18} className="text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card"
            >
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-6">
                Benefits for Your Business
              </h2>
              <ul className="space-y-3">
                {service.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-foreground text-sm sm:text-base">
                    <Check size={18} className="text-primary mt-0.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-14 sm:py-16 md:py-20 section-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center mb-8 sm:mb-12"
          >
            Explore Other Services
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {otherServices.map((s, i) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-card shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-300 overflow-hidden h-full"
                >
                  <div className="h-36 bg-muted/30 flex items-center justify-center p-4">
                    <img src={s.image} alt={s.title} className="h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-foreground mb-1">{s.title}</h3>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                      Learn More <ArrowRight size={14} />
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28 bg-gradient-cta relative overflow-hidden">
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
              Interested in {service.title}?
            </h2>
            <p className="text-primary-foreground/80 text-base sm:text-lg mb-6 sm:mb-8">
              Let's discuss how we can help your business grow online.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold h-11 sm:h-12 touch-manipulation"
                asChild
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 h-11 sm:h-12 touch-manipulation"
                asChild
              >
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
