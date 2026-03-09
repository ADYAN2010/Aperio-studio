import imgLocalBusiness from "@/assets/portfolio-local-business.jpg";
import imgRestaurant from "@/assets/portfolio-restaurant.jpg";
import imgEcommerce from "@/assets/portfolio-ecommerce.jpg";
import imgCorporate from "@/assets/portfolio-corporate.jpg";
import imgPersonal from "@/assets/portfolio-personal.jpg";
import imgStartup from "@/assets/portfolio-startup.jpg";
import imgGrowth from "@/assets/portfolio-growth.jpg";
import imgSocial from "@/assets/portfolio-social.jpg";
import imgCustom from "@/assets/portfolio-custom.jpg";

export interface ProjectData {
  slug: string;
  img: string;
  title: string;
  type: string;
  desc: string;
  challenge: string;
  solution: string;
  results: string[];
  features: string[];
  testimonial?: { quote: string; name: string; role: string };
}

export const projectsData: ProjectData[] = [
  {
    slug: "local-business-website",
    img: imgLocalBusiness,
    title: "Local Business Website",
    type: "Retail",
    desc: "A modern website for a local retail shop with product showcase and contact features.",
    challenge:
      "The business relied entirely on foot traffic and a Facebook page. Customers had no way to browse products online or find store details easily.",
    solution:
      "We built a clean, mobile-friendly website featuring a product showcase, store location with Google Maps, business hours, and a WhatsApp contact button for instant inquiries.",
    results: [
      "60% increase in online inquiries within the first month",
      "Customers could browse products before visiting the store",
      "Higher credibility compared to competitors without websites",
      "Improved Google search visibility for local searches",
    ],
    features: [
      "Product showcase gallery",
      "Google Maps integration",
      "WhatsApp quick contact",
      "Mobile-responsive design",
      "SEO-optimized pages",
    ],
    testimonial: {
      quote: "Our customers now find us online and come to the store already knowing what they want. It has transformed our business.",
      name: "Rahman Ahmed",
      role: "Shop Owner",
    },
  },
  {
    slug: "restaurant-website",
    img: imgRestaurant,
    title: "Restaurant Website",
    type: "Food & Dining",
    desc: "A responsive website with menu display, location map, and online booking.",
    challenge:
      "The restaurant had no online presence beyond social media. Customers couldn't view the menu or make reservations online, leading to missed bookings.",
    solution:
      "We created a visually appealing website with a digital menu, table reservation form, photo gallery, and location map to make the dining experience seamless from discovery to visit.",
    results: [
      "Online reservations increased by 40%",
      "Menu views helped customers decide before arriving",
      "Reduced phone calls for basic inquiries",
      "Better visibility on Google for local food searches",
    ],
    features: [
      "Digital menu with categories",
      "Online table reservation",
      "Photo gallery",
      "Location map and directions",
      "Social media integration",
    ],
    testimonial: {
      quote: "Having our menu online means customers already know what they want when they arrive. The reservation system saves us so much time.",
      name: "Fatima Begum",
      role: "Restaurant Manager",
    },
  },
  {
    slug: "ecommerce-store",
    img: imgEcommerce,
    title: "E-commerce Store",
    type: "Online Shopping",
    desc: "An online store with product catalog, shopping cart, and secure checkout.",
    challenge:
      "The business was selling only through a physical store and social media DMs. Order management was manual and error-prone, limiting growth potential.",
    solution:
      "We built a full e-commerce platform with product categories, search functionality, a shopping cart, secure payment integration, and an admin dashboard for order management.",
    results: [
      "Sales increased by 75% within three months",
      "Automated order management saved hours daily",
      "Customers could shop 24/7 from anywhere",
      "Reduced order errors with digital tracking",
    ],
    features: [
      "Product catalog with categories",
      "Shopping cart and checkout",
      "Payment gateway integration",
      "Order management dashboard",
      "Customer account system",
      "Inventory tracking",
    ],
    testimonial: {
      quote: "We went from managing orders in a notebook to a professional online store. Our sales have never been better.",
      name: "Kamal Hossain",
      role: "Business Owner",
    },
  },
  {
    slug: "corporate-business-website",
    img: imgCorporate,
    title: "Corporate Business Website",
    type: "Corporate",
    desc: "A professional company website with service pages and contact system.",
    challenge:
      "The company had an outdated website that didn't reflect their professional services. Potential clients were turned away by the poor design and lack of information.",
    solution:
      "We redesigned the website with a modern, corporate look featuring detailed service pages, team profiles, a case study section, and a professional contact system.",
    results: [
      "Client inquiries increased by 50%",
      "Professional image aligned with company values",
      "Better engagement with detailed service information",
      "Improved search engine rankings",
    ],
    features: [
      "Modern corporate design",
      "Detailed service pages",
      "Team profiles section",
      "Contact form with email notifications",
      "Blog/news section",
      "SEO optimization",
    ],
  },
  {
    slug: "portfolio-website",
    img: imgPersonal,
    title: "Portfolio Website",
    type: "Creative / Freelancer",
    desc: "A personal portfolio website for a freelancer or creative professional.",
    challenge:
      "The freelancer was sharing work samples through social media and email attachments, making it difficult for potential clients to see their full body of work.",
    solution:
      "We created a sleek portfolio website with project galleries, an about section, skills showcase, and a contact form to help them present their work professionally.",
    results: [
      "Landed 3 new clients within the first month",
      "Professional online presence boosted credibility",
      "Easy for clients to browse and share work samples",
      "Streamlined inquiry process through contact form",
    ],
    features: [
      "Project gallery with filters",
      "About and skills section",
      "Contact form",
      "Responsive design",
      "Fast loading performance",
    ],
  },
  {
    slug: "startup-landing-page",
    img: imgStartup,
    title: "Startup Landing Page",
    type: "Startup",
    desc: "A modern landing page designed for startups to promote their services.",
    challenge:
      "The startup needed a fast, professional web presence to attract early users and investors but had limited budget and timeline.",
    solution:
      "We designed a high-converting landing page with a compelling hero section, feature highlights, social proof, pricing preview, and email signup integration.",
    results: [
      "200+ email signups in the first two weeks",
      "Professional image helped secure investor meetings",
      "Clear messaging improved user understanding",
      "Fast load time ensured low bounce rates",
    ],
    features: [
      "Hero section with CTA",
      "Feature highlights",
      "Testimonials / social proof",
      "Email signup integration",
      "Analytics tracking",
      "Mobile-first design",
    ],
  },
  {
    slug: "bespoke-growth-solutions",
    img: imgGrowth,
    title: "Bespoke Growth Solutions",
    type: "Digital Growth",
    desc: "Advanced digital growth strategies for businesses looking to scale online, combining analytics dashboards, automation systems, and performance-driven platforms.",
    challenge:
      "A growing e-commerce company was struggling to scale beyond their initial customer base. They lacked data visibility, had no automation in place, and were making marketing decisions without analytics.",
    solution:
      "We developed a comprehensive growth platform featuring real-time analytics dashboards, automated email marketing sequences, SEO optimization tools, and conversion tracking — all integrated into one unified system.",
    results: [
      "150% increase in organic traffic within 6 months",
      "Marketing automation saved 20+ hours per week",
      "Data-driven decisions improved ROI by 85%",
      "Customer acquisition cost reduced by 40%",
    ],
    features: [
      "Real-time analytics dashboard",
      "Marketing automation workflows",
      "SEO performance tracking",
      "Conversion funnel optimization",
      "Custom KPI reporting",
      "A/B testing framework",
    ],
    testimonial: {
      quote: "The growth platform transformed how we make decisions. We can now see exactly what's working and scale it instantly.",
      name: "Tanvir Islam",
      role: "CEO, ScaleUp Commerce",
    },
  },
  {
    slug: "social-media-handle",
    img: imgSocial,
    title: "Social Media Handle",
    type: "Social Media",
    desc: "Professional social media management and branding system including content strategy, profile optimization, and engagement tools for businesses.",
    challenge:
      "A fashion brand was posting inconsistently across platforms with no cohesive branding, resulting in low engagement and missed opportunities to connect with their target audience.",
    solution:
      "We built a complete social media management system with branded profile templates, a content calendar, engagement tracking dashboard, and automated posting schedules across all major platforms.",
    results: [
      "300% increase in social media engagement",
      "Consistent brand presence across 5 platforms",
      "Content planning time reduced by 60%",
      "Follower growth of 200% in 3 months",
    ],
    features: [
      "Multi-platform content calendar",
      "Brand identity templates",
      "Engagement analytics dashboard",
      "Automated posting schedules",
      "Audience insights and reporting",
      "Content performance tracking",
    ],
    testimonial: {
      quote: "Our social media went from chaotic to professional overnight. The content calendar and analytics tools are game-changers.",
      name: "Nusrat Jahan",
      role: "Brand Manager, StyleHouse BD",
    },
  },
  {
    slug: "custom-solutions",
    img: imgCustom,
    title: "Custom Solutions",
    type: "Custom Development",
    desc: "Fully customized web applications, integrations, advanced dashboards, and specialized digital platforms built for unique business requirements.",
    challenge:
      "A logistics company needed a specialized platform to manage fleet tracking, route optimization, and real-time delivery updates — something no off-the-shelf solution could provide.",
    solution:
      "We architected and built a custom web application with real-time GPS fleet tracking, automated route optimization, a driver management portal, and a customer-facing delivery tracking interface.",
    results: [
      "Delivery efficiency improved by 35%",
      "Real-time tracking reduced customer support calls by 50%",
      "Route optimization saved 25% on fuel costs",
      "Scalable architecture supporting 10x growth",
    ],
    features: [
      "Custom web application",
      "Real-time GPS integration",
      "Automated route optimization",
      "Driver management portal",
      "Customer tracking interface",
      "API integrations with third-party systems",
    ],
    testimonial: {
      quote: "No existing software could handle our requirements. Aperio Studios built exactly what we needed, and it's been running flawlessly.",
      name: "Rafiqul Alam",
      role: "Operations Director, SwiftLogistics",
    },
  },
];
