import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { usePublishedContent } from "@/hooks/usePublishedContent";
import {
  Lightbulb,
  Shield,
  TrendingUp,
  Heart,
  MessageSquare,
  FileText,
  Paintbrush,
  Rocket,
  Target,
  Eye,
  CalendarDays,
  CheckCircle2,
  Users,
  Globe,
  Award,
} from "lucide-react";

const defaultStats = [
  { icon: Users, value: "50+", label: "Happy Clients" },
  { icon: Globe, value: "80+", label: "Websites Built" },
  { icon: Award, value: "99%", label: "Client Satisfaction" },
  { icon: TrendingUp, value: "3+", label: "Years Experience" },
];

const statIcons = [Users, Globe, Award, TrendingUp];

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "We use cutting-edge technologies and modern design principles to create websites that stand out and perform exceptionally.",
  },
  {
    icon: Shield,
    title: "Reliability",
    desc: "We provide dependable service with transparent communication, on-time delivery, and ongoing support you can count on.",
  },
  {
    icon: TrendingUp,
    title: "Growth-Focused",
    desc: "Every website we build is designed with one goal: to help your business attract more customers and grow revenue.",
  },
  {
    icon: Heart,
    title: "Client-First Approach",
    desc: "We listen to your needs, understand your vision, and tailor every solution to fit your unique business requirements.",
  },
];

const steps = [
  { icon: MessageSquare, title: "Discovery & Consultation", desc: "We deeply understand your business, audience, and goals through detailed discussions." },
  { icon: FileText, title: "Strategic Planning", desc: "We create a comprehensive plan including sitemap, features, and design direction." },
  { icon: Paintbrush, title: "Design & Development", desc: "We build your website with attention to detail, performance, and user experience." },
  { icon: Rocket, title: "Launch & Growth", desc: "We deploy your website and provide ongoing support to ensure continued success." },
];

const defaultTeam = [
  { name: "Arif Rahman", role: "Founder & Lead Developer", desc: "Full-stack developer with 5+ years of experience, passionate about empowering Bangladeshi businesses through professional web solutions.", image: "/lovable-uploads/35497b86-a46a-445b-82a4-3e492adc7272.png" },
  { name: "Nusrat Jahan", role: "UI/UX Designer", desc: "Creates intuitive, modern designs that help businesses make a powerful first impression and keep visitors engaged.", image: "" },
  { name: "Tanvir Hasan", role: "SEO & Marketing Specialist", desc: "Helps clients dominate search results and grow their online visibility with data-driven strategies and proven techniques.", image: "" },
];

const About = () => {
  const { get } = usePublishedContent("about");

  const headline = get("headline", "Building Digital Success for Businesses");
  const description = get("description", "Aperio Studios is a professional web development studio dedicated to helping businesses establish and grow their online presence through modern, affordable websites.");
  const mission = get("mission", "To empower businesses in Bangladesh by providing professional, affordable website development services that help them establish a strong digital presence and reach more customers.");
  const vision = get("vision", "To become the most trusted web development partner for businesses across Bangladesh, enabling every enterprise — no matter how small — to compete and thrive in the digital economy.");
  const cmsStats: { value: string; label: string }[] | null = get("stats", null);
  const stats = cmsStats
    ? cmsStats.map((s, i) => ({ ...s, icon: statIcons[i] || TrendingUp }))
    : defaultStats;
  const team: { name: string; role: string; desc: string; image?: string }[] = get("team", defaultTeam);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About Us"
        description="Learn about Aperio Studios — a professional web development studio dedicated to helping businesses grow online with modern, affordable websites."
        path="/about"
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
            🏢 About Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            {headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card max-w-4xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <stat.icon size={20} className="text-primary sm:w-6 sm:h-6" />
                  </div>
                  <p className="font-heading text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-muted-foreground text-xs sm:text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Target size={24} className="text-primary" />
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">
                {mission}
              </p>
              <p className="text-foreground text-sm sm:text-base font-medium">
                Every project starts with a <span className="text-primary font-semibold">personalized consultation</span> to understand your unique business needs.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 sm:p-8 shadow-card"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Eye size={24} className="text-primary" />
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">
                {vision}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28 section-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The principles that guide everything we do at Aperio Studios.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card text-center hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">Our Approach</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Consultation-driven website development tailored to each business. Here's how we work with you.
            </p>
          </motion.div>
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
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card pt-8 hover:shadow-card-hover transition-all duration-300">
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

      {/* Team */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28 section-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A dedicated team of professionals committed to delivering exceptional results for your business.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card text-center hover:shadow-card-hover transition-all duration-300"
              >
                {m.image ? (
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto mb-4 border-2 border-border"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="font-heading text-2xl font-bold text-primary">
                      {m.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                )}
                <h3 className="font-heading font-bold text-foreground mb-1">{m.name}</h3>
                <p className="text-primary text-xs font-medium mb-3">{m.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
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
              Ready to Grow Your Business Online?
            </h2>
            <p className="text-primary-foreground/80 text-base sm:text-lg mb-6 px-2 leading-relaxed">
              Join 50+ businesses that have transformed their online presence with Aperio Studios. Schedule your free consultation today.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {["Free consultation", "No obligation", "Custom plan"].map((item) => (
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

export default About;
