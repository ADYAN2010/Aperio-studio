import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check, CalendarDays, CheckCircle2, Clock, Shield, Headphones,
  Sparkles, Star, Zap, ShoppingCart, Building2, Layers, Ticket, X,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { usePromoCode } from "@/hooks/usePromoCode";
import { usePublishedContent } from "@/hooks/usePublishedContent";
import type { User } from "@supabase/supabase-js";

const MEMBER_DISCOUNT = 0.1; // 10% member discount

const plans = [
  {
    name: "Starter Website",
    price: 15000,
    icon: Zap,
    popular: false,
    description: "Perfect for small businesses and personal projects that need a professional online presence.",
    features: [
      "Up to 5 pages",
      "Mobile responsive design",
      "Basic SEO setup",
      "Contact form integration",
      "Basic performance optimization",
    ],
  },
  {
    name: "Small Business Website",
    price: 25000,
    icon: Star,
    popular: false,
    description: "Ideal for growing businesses that need a comprehensive website with advanced features.",
    features: [
      "Up to 8 pages",
      "Custom design layout",
      "SEO optimization",
      "Google Analytics integration",
      "Speed optimization",
    ],
  },
  {
    name: "Professional Business",
    price: 40000,
    icon: Sparkles,
    popular: true,
    description: "Best for established businesses that need advanced design, content, and tracking tools.",
    features: [
      "Up to 12 pages",
      "Advanced UI/UX design",
      "SEO optimization",
      "Analytics + tracking tools",
      "Blog system integration",
    ],
  },
  {
    name: "E-Commerce Website",
    price: 60000,
    icon: ShoppingCart,
    popular: false,
    description: "Complete online store solution with product management, payments, and order tracking.",
    features: [
      "Online store system",
      "Product management dashboard",
      "Payment gateway integration",
      "Order management system",
      "Mobile optimized store",
    ],
  },
  {
    name: "Enterprise Website",
    price: 90000,
    icon: Building2,
    popular: false,
    description: "Fully custom solution for large businesses requiring top-tier design, performance, and support.",
    features: [
      "Fully custom design",
      "Advanced SEO strategy",
      "Automation features",
      "Advanced performance optimization",
      "Priority support",
    ],
  },
];

const customPlan = {
  name: "Custom Project",
  icon: Layers,
  description: "For businesses with unique requirements or complex platforms.",
  features: [
    "Custom functionality",
    "Full design customization",
    "Scalable architecture",
    "Dedicated development support",
  ],
};

const faqs = [
  {
    q: "How long does it take to build a website?",
    a: "Depending on the plan, a Starter Website can be delivered within 5–7 days. Business and E-commerce websites typically take 2–4 weeks depending on the complexity and requirements.",
  },
  {
    q: "Can I request design changes during development?",
    a: "Yes! We work closely with you throughout the design process and offer revisions to ensure the final website matches your vision and brand identity.",
  },
  {
    q: "Do you provide website maintenance after launch?",
    a: "Absolutely. All plans include a support period after launch. We also offer ongoing maintenance packages to keep your website fast, secure, and up to date.",
  },
  {
    q: "What if I need a custom feature not listed in the plans?",
    a: "We offer custom website development for unique requirements. Book a consultation and we'll discuss your specific needs, timeline, and provide a tailored quote.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes, we can arrange flexible payment terms for larger projects. Typically, we work with a 50% upfront payment and 50% upon delivery.",
  },
];

const formatPrice = (n: number) => `৳${n.toLocaleString("en-IN")}`;

const Pricing = () => {
  const { get } = usePublishedContent("pricing");
  const [user, setUser] = useState<User | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const { applyCode, clearCode, result: promoResult, loading: promoLoading, getDiscountedPrice } = usePromoCode();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  // CMS pricing plans override
  const iconMap = [Zap, Star, Sparkles, ShoppingCart, Building2];
  const cmsPricingPlans: { name: string; price: string; description: string; features: string[]; popular: boolean }[] | null = get("pricing_plans", null);
  const displayPlans = cmsPricingPlans
    ? cmsPricingPlans.map((cp, i) => ({
        name: cp.name,
        price: parseInt(cp.price.replace(/[^\d]/g, "")) || 0,
        icon: iconMap[i] || Zap,
        popular: cp.popular,
        description: cp.description,
        features: cp.features,
      }))
    : plans;

  const calcPrice = (base: number) => {
    let price = base;
    if (user) price = Math.round(base * (1 - MEMBER_DISCOUNT));
    if (promoResult?.valid) price = getDiscountedPrice(price);
    return price;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Pricing"
        description="Affordable website development packages starting from ৳15,000. Choose from 5 predefined plans or request a custom quote."
        path="/pricing"
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
            💰 Transparent Pricing
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Affordable Website Development
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Clear, honest pricing with no hidden fees. Choose the plan that fits your business.
          </motion.p>
          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
            >
              <Sparkles size={14} />
              Special offer for members — 10% off all plans!
            </motion.div>
          )}
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {displayPlans.map((plan, i) => {
              const finalPrice = calcPrice(plan.price);
              const hasDiscount = finalPrice < plan.price;

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className={`group relative rounded-2xl border p-6 sm:p-8 flex flex-col transition-shadow duration-300 ${
                    plan.popular
                      ? "border-primary shadow-hero bg-primary/[0.03] ring-1 ring-primary/20"
                      : "border-border shadow-card bg-card hover:shadow-hero hover:border-primary/30"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full shadow-md">
                      ⭐ Most Popular
                    </span>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? "bg-primary/15" : "bg-primary/10"}`}>
                      <plan.icon size={20} className="text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground">{plan.name}</h3>
                  </div>

                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{plan.description}</p>

                  <div className="mb-6">
                    <p className="text-muted-foreground text-xs mb-1">Starting from</p>
                    {hasDiscount && (
                      <p className="text-muted-foreground text-sm line-through">{formatPrice(plan.price)}</p>
                    )}
                    <p className={`font-heading text-3xl sm:text-4xl font-bold ${hasDiscount ? "text-green-600 dark:text-green-400" : "text-primary"}`}>
                      {formatPrice(finalPrice)}
                    </p>
                    {hasDiscount && (
                      <p className="text-green-600 dark:text-green-400 text-xs font-medium mt-1">
                        You save {formatPrice(plan.price - finalPrice)}!
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check size={16} className="text-primary mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.popular ? "hero" : "heroOutline"}
                    size="lg"
                    className="w-full gap-2 touch-manipulation"
                    asChild
                  >
                    <Link to="/book-meeting">
                      <CalendarDays size={16} />
                      Book a Schedule
                    </Link>
                  </Button>
                </motion.div>
              );
            })}

            {/* Custom Project Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-dashed border-primary/40 p-6 sm:p-8 flex flex-col bg-primary/[0.02] hover:shadow-hero hover:border-primary/60 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <customPlan.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">{customPlan.name}</h3>
              </div>

              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{customPlan.description}</p>

              <div className="mb-6">
                <p className="text-muted-foreground text-xs mb-1">Pricing</p>
                <p className="font-heading text-3xl sm:text-4xl font-bold text-primary">Custom Quote</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {customPlan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check size={16} className="text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button variant="hero" size="lg" className="w-full gap-2 touch-manipulation" asChild>
                <Link to="/book-meeting">
                  <CalendarDays size={16} />
                  Request Custom Quote
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Redeem Code Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto mt-12 sm:mt-16"
          >
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Ticket size={20} className="text-primary" />
                <h3 className="font-heading text-lg font-bold text-foreground">Redeem Code</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">Have a promo code? Enter it below for a discount.</p>

              {promoResult?.valid ? (
                <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                  <span className="text-green-700 dark:text-green-400 text-sm font-medium">{promoResult.message}</span>
                  <button onClick={clearCode} className="text-green-600 hover:text-green-800 dark:hover:text-green-300">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      className="text-center font-mono tracking-wider uppercase"
                      onKeyDown={(e) => e.key === "Enter" && applyCode(promoInput)}
                    />
                    <Button
                      onClick={() => applyCode(promoInput)}
                      disabled={promoLoading}
                      variant="heroOutline"
                    >
                      {promoLoading ? "..." : "Apply Code"}
                    </Button>
                  </div>
                  {promoResult && !promoResult.valid && (
                    <p className="text-destructive text-sm mt-2">{promoResult.message}</p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-14 sm:py-16 md:py-20 section-soft">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-10"
          >
            Every Plan Includes
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Shield, text: "SSL Security Certificate" },
              { icon: Clock, text: "Fast Loading Speed" },
              { icon: CheckCircle2, text: "Mobile Responsive Design" },
              { icon: Headphones, text: "Post-Launch Support" },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card shadow-card"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 sm:py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-8 sm:mb-12"
          >
            Frequently Asked Questions
          </motion.h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border rounded-xl px-5 sm:px-6 bg-card shadow-card"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
              Ready to Invest in Your Business Growth?
            </h2>
            <p className="text-primary-foreground/80 text-base sm:text-lg mb-6 sm:mb-8 px-2 leading-relaxed">
              Schedule a free consultation to discuss your project requirements and get a personalized quote.
            </p>
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
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
