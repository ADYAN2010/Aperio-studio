import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Quote } from "lucide-react";
import { projectsData } from "@/data/projects";
import NotFound from "./NotFound";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 sm:pt-40 md:pt-44 lg:pt-48 pb-14 sm:pb-16 md:pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <div className="flex-1">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {project.type}
              </span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-4"
              >
                {project.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground text-base sm:text-lg max-w-xl"
              >
                {project.desc}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="w-full md:w-[45%] rounded-2xl overflow-hidden shadow-card border border-border shrink-0"
            >
              <img
                src={project.img}
                alt={project.title}
                className="w-full aspect-video object-cover"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenge & Solution */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card"
            >
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-4">
                The Challenge
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {project.challenge}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 sm:p-8 shadow-card"
            >
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-4">
                Our Solution
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {project.solution}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features & Results */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-6">
                Key Features
              </h2>
              <ul className="space-y-3">
                {project.features.map((f) => (
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
            >
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-6">
                Results
              </h2>
              <ul className="space-y-3">
                {project.results.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-foreground text-sm sm:text-base">
                    <Check size={18} className="text-primary mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {project.testimonial && (
        <section className="py-14 sm:py-16 md:py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <Quote size={40} className="text-primary/20 mx-auto mb-4" />
              <p className="text-foreground text-lg sm:text-xl md:text-2xl font-medium italic leading-relaxed mb-6">
                "{project.testimonial.quote}"
              </p>
              <p className="font-heading font-bold text-foreground">
                {project.testimonial.name}
              </p>
              <p className="text-muted-foreground text-sm">
                {project.testimonial.role}
              </p>
            </motion.div>
          </div>
        </section>
      )}

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
              Want a Similar Website?
            </h2>
            <p className="text-primary-foreground/80 text-base sm:text-lg mb-6 sm:mb-8">
              Let Aperio Studios build a professional website for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold h-11 sm:h-12 touch-manipulation"
                asChild
              >
                <a href="/#contact">Contact Us</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 h-11 sm:h-12 touch-manipulation"
                asChild
              >
                <Link to="/portfolio">View More Projects</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
