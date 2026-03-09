import { ShieldAlert, Search, Trophy, TrendingDown, Clock, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { usePublishedContent } from "@/hooks/usePublishedContent";

const iconMap: Record<string, any> = { Search, ShieldAlert, Trophy, TrendingDown, Clock, UserX };

const defaultProblems = [
  { icon: "Search", title: "Invisible to Online Customers", desc: "Without a website, potential customers searching online will never find your business. You're losing leads every day to competitors who show up in search results.", stat: "97%", statLabel: "of customers search online before buying" },
  { icon: "ShieldAlert", title: "Lack of Business Credibility", desc: "Businesses without a professional website appear less trustworthy. Customers often question the legitimacy of businesses that only exist on social media.", stat: "75%", statLabel: "judge credibility based on website design" },
  { icon: "Trophy", title: "Losing to Competitors", desc: "Your competitors with professional websites are capturing the customers you're missing. Every day without a website is a day your competition grows stronger.", stat: "3x", statLabel: "more leads for businesses with websites" },
  { icon: "TrendingDown", title: "Limited Growth Potential", desc: "Relying solely on word-of-mouth and social media limits your growth. A website works 24/7, reaching customers even when you're not actively marketing.", stat: "24/7", statLabel: "online availability for your business" },
  { icon: "Clock", title: "Wasting Time on Manual Processes", desc: "Without a website, you spend hours answering the same questions. A website automates information sharing, bookings, and customer inquiries.", stat: "60%", statLabel: "of inquiries can be automated" },
  { icon: "UserX", title: "No Customer Engagement", desc: "Without a digital presence, you miss opportunities to engage customers with updates, promotions, and valuable content that builds loyalty.", stat: "80%", statLabel: "of customers expect an online presence" },
];

const ProblemSection = () => {
  const { get } = usePublishedContent("homepage");
  const sectionBadge = get("problem_badge", "⚠️ Common Business Challenges");
  const sectionTitle = get("problem_title", "Is Your Business Struggling Without a Website?");
  const sectionDesc = get("problem_description", "Many businesses in Bangladesh face these critical challenges. Without a professional online presence, growth is limited and opportunities are lost.");
  const problems: typeof defaultProblems = get("problems", defaultProblems);

  return (
    <section className="py-14 sm:py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs sm:text-sm font-medium mb-4">
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
          {problems.map((p, i) => {
            const Icon = iconMap[p.icon] || ShieldAlert;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-card hover:shadow-card-hover hover:border-destructive/20 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/15 transition-colors">
                    <Icon size={22} className="text-destructive" />
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-2xl font-bold text-foreground">{p.stat}</p>
                    <p className="text-muted-foreground text-[10px] sm:text-xs max-w-[100px] leading-tight">{p.statLabel}</p>
                  </div>
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
