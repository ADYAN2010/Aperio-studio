import { Shield, DollarSign, Smartphone, Headphones, TrendingUp, Clock, Palette, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { usePublishedContent } from "@/hooks/usePublishedContent";

const iconMap: Record<string, any> = { TrendingUp, Smartphone, DollarSign, Headphones, Palette, Clock, Shield, Zap };

const defaultBenefits = [
  { icon: "TrendingUp", title: "Increased Online Credibility", desc: "A professional website establishes trust and makes your business look legitimate to potential customers searching online." },
  { icon: "Smartphone", title: "Mobile-Friendly Websites", desc: "Every website we build is fully responsive, ensuring your customers have a great experience on phones, tablets, and desktops." },
  { icon: "DollarSign", title: "Affordable Pricing", desc: "We offer competitive pricing packages designed specifically for small and medium businesses in Bangladesh." },
  { icon: "Headphones", title: "Dedicated Client Support", desc: "Our team provides ongoing support and assistance to ensure your website runs smoothly after launch." },
  { icon: "Palette", title: "Custom Modern Design", desc: "No generic templates. We create unique, modern designs that reflect your brand identity and stand out from competitors." },
  { icon: "Clock", title: "24/7 Online Presence", desc: "Your website works around the clock, providing business information and generating leads even while you sleep." },
  { icon: "Shield", title: "Secure & Reliable", desc: "We implement industry-standard security practices to keep your website and customer data safe and protected." },
  { icon: "Zap", title: "Fast Loading Speed", desc: "Optimized performance ensures your website loads quickly, reducing bounce rates and improving user experience." },
];

const WhyChooseSection = () => {
  const { get } = usePublishedContent("homepage");
  const sectionBadge = get("whychoose_badge", "⚡ Client Benefits");
  const sectionTitle = get("whychoose_title", "Why Businesses Choose Aperio Studios");
  const sectionDesc = get("whychoose_description", "We combine quality design, affordable pricing, and reliable support to deliver websites that truly help your business grow.");
  const benefits: typeof defaultBenefits = get("benefits", defaultBenefits);

  return (
    <section id="about" className="py-14 sm:py-16 md:py-20 lg:py-28">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {benefits.map((b, i) => {
            const Icon = iconMap[b.icon] || Shield;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2 text-sm sm:text-base">{b.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
