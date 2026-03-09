import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { usePublishedContent } from "@/hooks/usePublishedContent";

const defaultTestimonials = [
  {
    name: "Rafiq Ahmed",
    business: "Ahmed Textiles, Dhaka",
    quote: "Before working with Aperio Studios, we had no online presence. Now our website brings in 40% of our new customer inquiries. The team was professional, responsive, and truly understood our business needs.",
    initials: "RA",
    role: "Business Owner",
  },
  {
    name: "Sabrina Karim",
    business: "Sabrina's Kitchen, Chittagong",
    quote: "Aperio Studios transformed our small restaurant business. The website they built is beautiful, mobile-friendly, and customers love being able to see our menu online. Our online orders increased by 60% in just two months.",
    initials: "SK",
    role: "Restaurant Owner",
  },
  {
    name: "Mohammad Hasan",
    business: "Hasan Electronics, Sylhet",
    quote: "I was hesitant about investing in a website, but Aperio Studios made the entire process simple and affordable. Our e-commerce site now generates consistent online sales and has helped us reach customers beyond Sylhet.",
    initials: "MH",
    role: "E-commerce Owner",
  },
  {
    name: "Fatima Rahman",
    business: "Rahman Law Associates",
    quote: "The team at Aperio Studios delivered a professional website that perfectly represents our law firm. Clients frequently compliment our online presence, and we've seen a significant increase in consultation requests.",
    initials: "FR",
    role: "Managing Partner",
  },
  {
    name: "Kamal Uddin",
    business: "Green Valley Farms",
    quote: "As a farming business, I never thought we needed a website. Aperio Studios showed us how it could help reach wholesale buyers. Within 3 months, we connected with 15 new buyers through our website.",
    initials: "KU",
    role: "Farm Owner",
  },
  {
    name: "Nusrat Begum",
    business: "Nusrat Fashion House",
    quote: "Our old website was outdated and slow. Aperio Studios redesigned it completely and the results were immediate — faster loading, better design, and a 50% increase in customer engagement.",
    initials: "NB",
    role: "Fashion Designer",
  },
];

const TestimonialsSection = () => {
  const { get } = usePublishedContent("homepage");

  // CMS testimonials have { name, role, text } shape; map to display format
  const cmsTestimonials = get("testimonials", null);
  const testimonials = cmsTestimonials
    ? (cmsTestimonials as any[]).map((t: any) => ({
        name: t.name,
        business: t.business || "",
        quote: t.text || t.quote || "",
        initials: t.name
          ?.split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "",
        role: t.role,
      }))
    : defaultTestimonials;

  return (
    <section className="py-14 sm:py-16 md:py-20 lg:py-28 section-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-secondary/30 text-secondary-foreground text-xs sm:text-sm font-medium mb-4">
            ⭐ Client Success Stories
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Businesses Across Bangladesh
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            See how businesses like yours have transformed their online presence with Aperio Studios.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {testimonials.map((t: any, i: number) => (
            <motion.div
              key={t.name + i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="fill-primary text-primary" />
                ))}
              </div>
              <div className="mb-3">
                <Quote size={20} className="text-primary/30" />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-5">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-heading text-xs font-bold text-primary">{t.initials}</span>
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {t.role}{t.business ? ` · ${t.business}` : ""}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
