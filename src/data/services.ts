import {
  Globe,
  ShoppingCart,
  Building2,
  Rocket,
  Palette,
  RefreshCw,
  TrendingUp,
  Share2,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import serviceBusiness from "@/assets/service-business.png";
import serviceEcommerce from "@/assets/service-ecommerce.png";
import serviceCorporate from "@/assets/service-corporate.png";
import serviceStartup from "@/assets/service-startup.png";
import servicePortfolio from "@/assets/service-portfolio.png";
import serviceRedesign from "@/assets/service-redesign.png";
import serviceGrowth from "@/assets/service-growth.png";
import serviceSocial from "@/assets/service-social.png";
import serviceCustom from "@/assets/service-custom.png";

export interface ServiceData {
  slug: string;
  icon: LucideIcon;
  image: string;
  title: string;
  desc: string;
  longDesc: string;
  features: string[];
  benefits: string[];
  bestFor: string;
}

export const servicesData: ServiceData[] = [
  {
    slug: "business-website-development",
    icon: Globe,
    image: serviceBusiness,
    title: "Business Website Development",
    desc: "Professional websites designed for businesses, shops, and companies that want to build trust and attract more customers online.",
    longDesc:
      "A professional website is the foundation of your online presence. We design and build modern, fast-loading websites that represent your brand, showcase your products or services, and convert visitors into customers. Whether you run a restaurant, a clothing shop, or a consultancy firm — we create a website that works for your business.",
    features: [
      "Custom homepage and inner pages",
      "Mobile-responsive design",
      "Contact forms and WhatsApp integration",
      "Google Maps integration",
      "Basic SEO setup",
      "Social media links",
    ],
    benefits: [
      "Build credibility and trust with customers",
      "Be found online by new customers",
      "Showcase your products and services 24/7",
      "Stand out from competitors without websites",
    ],
    bestFor: "Small to medium businesses, startups, and local businesses",
  },
  {
    slug: "ecommerce-website-development",
    icon: ShoppingCart,
    image: serviceEcommerce,
    title: "E-commerce Website Development",
    desc: "Online stores that allow businesses to sell products digitally with secure payment systems and easy product management.",
    longDesc:
      "Take your business online with a fully functional e-commerce store. We build secure, easy-to-manage online shops that let you list products, accept payments, and manage orders — all from one dashboard. Perfect for fashion brands, grocery stores, electronics shops, and more.",
    features: [
      "Product listing and categories",
      "Secure payment gateway integration",
      "Order management dashboard",
      "Inventory tracking",
      "Customer account system",
      "Mobile-optimized shopping experience",
    ],
    benefits: [
      "Sell products 24/7 without a physical store",
      "Reach customers across Bangladesh and beyond",
      "Automate order and inventory management",
      "Increase revenue with digital sales channels",
    ],
    bestFor: "Retail businesses, product sellers, and wholesale distributors",
  },
  {
    slug: "corporate-company-websites",
    icon: Building2,
    image: serviceCorporate,
    title: "Corporate / Company Websites",
    desc: "Enterprise-grade websites that establish authority, showcase company culture, and engage investors and partners.",
    longDesc:
      "Your corporate website is the digital face of your organization. We create sophisticated, high-performance websites that communicate your company's values, showcase leadership teams, highlight achievements, and provide seamless experiences for investors, partners, and clients.",
    features: [
      "Multi-page corporate structure",
      "Team and leadership profiles",
      "Investor relations section",
      "Career and job listings pages",
      "News and press release section",
      "Multi-language support ready",
    ],
    benefits: [
      "Establish corporate authority and trust",
      "Attract top talent with professional presence",
      "Engage stakeholders with clear communication",
      "Scale your brand identity across markets",
    ],
    bestFor: "Established companies, enterprises, and corporate organizations",
  },
  {
    slug: "startup-landing-pages",
    icon: Rocket,
    image: serviceStartup,
    title: "Startup Landing Pages",
    desc: "High-converting landing pages designed to validate ideas, capture leads, and launch products with maximum impact.",
    longDesc:
      "Speed to market is everything for startups. We design and build stunning landing pages that communicate your value proposition in seconds, capture leads, and drive conversions. Perfect for product launches, beta signups, and investor pitches.",
    features: [
      "Conversion-optimized design",
      "Lead capture forms and CTAs",
      "A/B testing ready structure",
      "Analytics and tracking integration",
      "Fast loading performance",
      "Social proof and testimonial sections",
    ],
    benefits: [
      "Launch and validate ideas quickly",
      "Maximize conversion rates from day one",
      "Impress investors with professional presence",
      "Build an email list before full product launch",
    ],
    bestFor: "Startups, SaaS founders, and product launch teams",
  },
  {
    slug: "portfolio-websites",
    icon: Palette,
    image: servicePortfolio,
    title: "Portfolio Websites",
    desc: "Showcase your creative work, projects, and professional skills with a stunning portfolio that leaves a lasting impression.",
    longDesc:
      "Your portfolio is your most powerful marketing tool. We create beautiful, interactive portfolio websites that highlight your best work, tell your story, and make it easy for clients and employers to reach out. Designed for creatives, freelancers, and professionals.",
    features: [
      "Visual project showcase gallery",
      "Filterable portfolio categories",
      "Case study and project detail pages",
      "About and skills section",
      "Client testimonials integration",
      "Contact and inquiry forms",
    ],
    benefits: [
      "Make a memorable first impression",
      "Attract clients and job opportunities",
      "Organize and present your best work",
      "Stand out in a competitive creative market",
    ],
    bestFor: "Freelancers, designers, photographers, and creative professionals",
  },
  {
    slug: "website-redesign-optimization",
    icon: RefreshCw,
    image: serviceRedesign,
    title: "Website Redesign & Optimization",
    desc: "Transform outdated websites into modern, fast, and conversion-optimized experiences that drive real business results.",
    longDesc:
      "If your current website looks outdated, loads slowly, or doesn't convert visitors, it's time for a redesign. We analyze your existing site, identify performance bottlenecks, and rebuild it with modern design, faster technology, and better user experience.",
    features: [
      "Complete UI/UX redesign",
      "Performance and speed optimization",
      "Mobile-first responsive overhaul",
      "SEO audit and improvements",
      "Content restructuring",
      "Analytics and conversion tracking",
    ],
    benefits: [
      "Dramatically improve user experience",
      "Reduce bounce rates with faster loading",
      "Boost search engine rankings",
      "Increase conversions and lead generation",
    ],
    bestFor: "Businesses with outdated or underperforming websites",
  },
  {
    slug: "bespoke-growth-solutions",
    icon: TrendingUp,
    image: serviceGrowth,
    title: "Bespoke Growth Solutions",
    desc: "Advanced digital growth strategies designed specifically for businesses looking to scale online. This service combines website optimization, automation tools, SEO strategy, and performance analytics.",
    longDesc:
      "Scaling your business online requires more than just a website — it demands a comprehensive growth strategy. Our Bespoke Growth Solutions combine website optimization, marketing automation, SEO strategy, and data-driven performance analytics to create a customized roadmap for your business. We analyze your current digital presence, identify growth opportunities, and implement targeted solutions that deliver measurable results.",
    features: [
      "Website performance optimization",
      "Marketing automation setup",
      "SEO strategy and implementation",
      "Performance analytics dashboards",
      "Conversion rate optimization",
      "Growth roadmap planning",
    ],
    benefits: [
      "Scale your online presence strategically",
      "Make data-driven business decisions",
      "Automate repetitive marketing tasks",
      "Increase organic traffic and conversions",
    ],
    bestFor: "Growing businesses, scale-ups, and companies seeking digital transformation",
  },
  {
    slug: "social-media-handle",
    icon: Share2,
    image: serviceSocial,
    title: "Social Media Handle",
    desc: "Professional social media setup and management services including profile creation, branding, content planning, engagement strategies, and platform optimization.",
    longDesc:
      "Your social media presence is a critical extension of your brand. We offer end-to-end social media setup and management — from creating and branding your profiles to developing content calendars, engagement strategies, and platform-specific optimization. Whether you're starting from scratch or need to revamp your existing presence, we ensure your brand shines across all platforms.",
    features: [
      "Profile creation and branding",
      "Content calendar planning",
      "Engagement strategy development",
      "Platform-specific optimization",
      "Visual content templates",
      "Analytics and reporting setup",
    ],
    benefits: [
      "Build a consistent brand across platforms",
      "Increase audience engagement and followers",
      "Save time with organized content planning",
      "Drive traffic from social media to your website",
    ],
    bestFor: "Businesses, influencers, and brands looking to grow their social media presence",
  },
  {
    slug: "custom-solutions",
    icon: Wrench,
    image: serviceCustom,
    title: "Custom Solutions",
    desc: "Fully customized development solutions for businesses with unique requirements. This can include custom web applications, integrations, advanced dashboards, or specialized digital platforms.",
    longDesc:
      "When off-the-shelf solutions don't fit your needs, our Custom Solutions service delivers tailor-made digital platforms built from the ground up. From complex web applications and third-party integrations to advanced admin dashboards and specialized digital platforms — we architect and develop solutions that perfectly align with your unique business requirements and workflows.",
    features: [
      "Custom web application development",
      "Third-party API integrations",
      "Advanced dashboard and admin panels",
      "Specialized platform development",
      "Custom workflow automation",
      "Scalable architecture design",
    ],
    benefits: [
      "Get exactly what your business needs",
      "Streamline unique business processes",
      "Integrate with your existing tools and systems",
      "Build scalable solutions that grow with you",
    ],
    bestFor: "Enterprises, startups with unique needs, and businesses requiring specialized platforms",
  },
];
