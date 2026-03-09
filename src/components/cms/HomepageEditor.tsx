import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Save, Loader2, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const defaultTestimonials = [
  { name: "Rafiq Ahmed", role: "Business Owner", business: "Ahmed Textiles, Dhaka", text: "Before working with Aperio Studios, we had no online presence. Now our website brings in 40% of our new customer inquiries." },
  { name: "Sabrina Karim", role: "Restaurant Owner", business: "Sabrina's Kitchen, Chittagong", text: "Aperio Studios transformed our small restaurant business. The website they built is beautiful and mobile-friendly." },
  { name: "Mohammad Hasan", role: "E-commerce Owner", business: "Hasan Electronics, Sylhet", text: "Our e-commerce site now generates consistent online sales and has helped us reach customers beyond Sylhet." },
];

const defaultProblems = [
  { icon: "Search", title: "Invisible to Online Customers", desc: "Without a website, potential customers searching online will never find your business.", stat: "97%", statLabel: "of customers search online before buying" },
  { icon: "ShieldAlert", title: "Lack of Business Credibility", desc: "Businesses without a professional website appear less trustworthy.", stat: "75%", statLabel: "judge credibility based on website design" },
  { icon: "Trophy", title: "Losing to Competitors", desc: "Your competitors with professional websites are capturing the customers you're missing.", stat: "3x", statLabel: "more leads for businesses with websites" },
  { icon: "TrendingDown", title: "Limited Growth Potential", desc: "Relying solely on word-of-mouth and social media limits your growth.", stat: "24/7", statLabel: "online availability for your business" },
  { icon: "Clock", title: "Wasting Time on Manual Processes", desc: "Without a website, you spend hours answering the same questions.", stat: "60%", statLabel: "of inquiries can be automated" },
  { icon: "UserX", title: "No Customer Engagement", desc: "Without a digital presence, you miss opportunities to engage customers.", stat: "80%", statLabel: "of customers expect an online presence" },
];

const defaultBenefits = [
  { icon: "TrendingUp", title: "Increased Online Credibility", desc: "A professional website establishes trust and makes your business look legitimate." },
  { icon: "Smartphone", title: "Mobile-Friendly Websites", desc: "Every website we build is fully responsive." },
  { icon: "DollarSign", title: "Affordable Pricing", desc: "Competitive pricing packages for small and medium businesses." },
  { icon: "Headphones", title: "Dedicated Client Support", desc: "Our team provides ongoing support and assistance." },
];

const defaultProcessSteps = [
  { icon: "MessageSquare", step: "01", title: "Business Consultation", desc: "We start by understanding your business, target audience, and website goals." },
  { icon: "FileText", step: "02", title: "Website Planning", desc: "Our team creates a tailored plan including sitemap, features, and design direction." },
  { icon: "Paintbrush", step: "03", title: "Design & Development", desc: "We design and build your website with modern UI and responsive layout." },
  { icon: "Rocket", step: "04", title: "Launch & Support", desc: "We launch your website and provide ongoing support and guidance." },
];

const defaultHeroStats = [
  { icon: "Users", value: "50+", label: "Happy Clients" },
  { icon: "Globe", value: "80+", label: "Websites Built" },
  { icon: "Award", value: "99%", label: "Client Satisfaction" },
];

// All CMS keys used by the homepage
const ALL_KEYS = [
  "hero_headline", "hero_description", "hero_button_1", "hero_button_2", "features",
  "hero_badge", "hero_stats", "testimonials",
  "problem_badge", "problem_title", "problem_description", "problems",
  "whychoose_badge", "whychoose_title", "whychoose_description", "benefits",
  "cta_title", "cta_description", "cta_button_1", "cta_button_2", "cta_badges",
  "process_badge", "process_title", "process_description", "process_steps",
  "process_cta_title", "process_cta_description", "process_cta_badges",
  "services_badge", "services_title", "services_description", "services_button",
  "portfolio_badge", "portfolio_title", "portfolio_description", "portfolio_button",
  "contact_badge", "contact_title", "contact_description",
];

const HomepageEditor = () => {
  const { loading, upsertContent, publishContent, getContent } = useSiteContent("homepage");
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Hero
  const [heroHeadline, setHeroHeadline] = useState("");
  const [heroDesc, setHeroDesc] = useState("");
  const [heroBtn1, setHeroBtn1] = useState("");
  const [heroBtn2, setHeroBtn2] = useState("");
  const [heroBadge, setHeroBadge] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [heroStats, setHeroStats] = useState<{ icon: string; value: string; label: string }[]>([]);

  // Problem
  const [problemBadge, setProblemBadge] = useState("");
  const [problemTitle, setProblemTitle] = useState("");
  const [problemDesc, setProblemDesc] = useState("");
  const [problems, setProblems] = useState<typeof defaultProblems>([]);

  // Why Choose
  const [whychooseBadge, setWhychooseBadge] = useState("");
  const [whychooseTitle, setWhychooseTitle] = useState("");
  const [whychooseDesc, setWhychooseDesc] = useState("");
  const [benefits, setBenefits] = useState<typeof defaultBenefits>([]);

  // CTA
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaDesc, setCtaDesc] = useState("");
  const [ctaBtn1, setCtaBtn1] = useState("");
  const [ctaBtn2, setCtaBtn2] = useState("");
  const [ctaBadges, setCtaBadges] = useState<string[]>([]);

  // Process
  const [processBadge, setProcessBadge] = useState("");
  const [processTitle, setProcessTitle] = useState("");
  const [processDesc, setProcessDesc] = useState("");
  const [processSteps, setProcessSteps] = useState<typeof defaultProcessSteps>([]);
  const [processCtaTitle, setProcessCtaTitle] = useState("");
  const [processCtaDesc, setProcessCtaDesc] = useState("");
  const [processCtaBadges, setProcessCtaBadges] = useState<string[]>([]);

  // Services section headers
  const [servicesBadge, setServicesBadge] = useState("");
  const [servicesTitle, setServicesTitle] = useState("");
  const [servicesDesc, setServicesDesc] = useState("");
  const [servicesBtn, setServicesBtn] = useState("");

  // Portfolio section headers
  const [portfolioBadge, setPortfolioBadge] = useState("");
  const [portfolioTitle, setPortfolioTitle] = useState("");
  const [portfolioDesc, setPortfolioDesc] = useState("");
  const [portfolioBtn, setPortfolioBtn] = useState("");

  // Contact section headers
  const [contactBadge, setContactBadge] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [contactDesc, setContactDesc] = useState("");

  // Testimonials
  const [testimonials, setTestimonials] = useState<{ name: string; role: string; business?: string; text: string }[]>([]);

  if (!loading && !initialized) {
    setHeroHeadline(getContent("hero_headline") || "Professional Websites That Help Your Business Grow");
    setHeroDesc(getContent("hero_description") || "Aperio Studios helps businesses build modern, high-performing websites.");
    setHeroBtn1(getContent("hero_button_1") || "Book a Schedule");
    setHeroBtn2(getContent("hero_button_2") || "View Our Portfolio");
    setHeroBadge(getContent("hero_badge") || "🚀 Creative Web Development Studio");
    setFeatures(getContent("features") || ["Mobile-Friendly Design", "SEO Optimized", "Fast Loading Speed", "24/7 Support"]);
    setHeroStats(getContent("hero_stats") || defaultHeroStats);
    setTestimonials(getContent("testimonials") || defaultTestimonials);
    setProblemBadge(getContent("problem_badge") || "⚠️ Common Business Challenges");
    setProblemTitle(getContent("problem_title") || "Is Your Business Struggling Without a Website?");
    setProblemDesc(getContent("problem_description") || "Many businesses face these critical challenges.");
    setProblems(getContent("problems") || defaultProblems);
    setWhychooseBadge(getContent("whychoose_badge") || "✅ Client Benefits");
    setWhychooseTitle(getContent("whychoose_title") || "Why Businesses Choose Aperio Studios");
    setWhychooseDesc(getContent("whychoose_description") || "We combine quality design, affordable pricing, and reliable support.");
    setBenefits(getContent("benefits") || defaultBenefits);
    setCtaTitle(getContent("cta_title") || "Ready to Grow Your Business Online?");
    setCtaDesc(getContent("cta_description") || "Join 50+ businesses that have transformed their online presence.");
    setCtaBtn1(getContent("cta_button_1") || "Book a Schedule");
    setCtaBtn2(getContent("cta_button_2") || "Contact Us");
    setCtaBadges(getContent("cta_badges") || ["Free consultation", "Custom website plan", "No upfront commitment"]);
    setProcessBadge(getContent("process_badge") || "📋 Our Process");
    setProcessTitle(getContent("process_title") || "From Consultation to Launch in 4 Simple Steps");
    setProcessDesc(getContent("process_description") || "We follow a proven process to ensure your website is built right.");
    setProcessSteps(getContent("process_steps") || defaultProcessSteps);
    setProcessCtaTitle(getContent("process_cta_title") || "Ready to Get Started?");
    setProcessCtaDesc(getContent("process_cta_description") || "Book a consultation to discuss your business goals.");
    setProcessCtaBadges(getContent("process_cta_badges") || ["Free consultation", "No obligation", "Personalized plan"]);
    setServicesBadge(getContent("services_badge") || "💼 What We Build");
    setServicesTitle(getContent("services_title") || "Professional Web Solutions for Every Business");
    setServicesDesc(getContent("services_description") || "From business websites to full e-commerce platforms.");
    setServicesBtn(getContent("services_button") || "View All Services");
    setPortfolioBadge(getContent("portfolio_badge") || "🎨 Our Work");
    setPortfolioTitle(getContent("portfolio_title") || "Websites That Drive Real Business Results");
    setPortfolioDesc(getContent("portfolio_description") || "Browse our portfolio of websites built for businesses.");
    setPortfolioBtn(getContent("portfolio_button") || "View Full Portfolio");
    setContactBadge(getContent("contact_badge") || "📬 Get in Touch");
    setContactTitle(getContent("contact_title") || "Let's Talk About Your Project");
    setContactDesc(getContent("contact_description") || "Have questions? Send us a message or schedule a meeting.");
    setInitialized(true);
  }

  const getAllData = (): Record<string, any> => ({
    hero_headline: heroHeadline, hero_description: heroDesc, hero_button_1: heroBtn1, hero_button_2: heroBtn2,
    hero_badge: heroBadge, features, hero_stats: heroStats, testimonials,
    problem_badge: problemBadge, problem_title: problemTitle, problem_description: problemDesc, problems,
    whychoose_badge: whychooseBadge, whychoose_title: whychooseTitle, whychoose_description: whychooseDesc, benefits,
    cta_title: ctaTitle, cta_description: ctaDesc, cta_button_1: ctaBtn1, cta_button_2: ctaBtn2, cta_badges: ctaBadges,
    process_badge: processBadge, process_title: processTitle, process_description: processDesc, process_steps: processSteps,
    process_cta_title: processCtaTitle, process_cta_description: processCtaDesc, process_cta_badges: processCtaBadges,
    services_badge: servicesBadge, services_title: servicesTitle, services_description: servicesDesc, services_button: servicesBtn,
    portfolio_badge: portfolioBadge, portfolio_title: portfolioTitle, portfolio_description: portfolioDesc, portfolio_button: portfolioBtn,
    contact_badge: contactBadge, contact_title: contactTitle, contact_description: contactDesc,
  });

  const handleSave = async () => {
    setSaving(true);
    const data = getAllData();
    for (const [key, value] of Object.entries(data)) {
      await upsertContent("homepage", key, value);
    }
    setSaving(false);
    toast.success("Changes saved as draft");
  };

  const handlePublishAll = async () => {
    setSaving(true);
    const data = getAllData();
    for (const [key, value] of Object.entries(data)) {
      await upsertContent("homepage", key, value);
    }
    for (const key of ALL_KEYS) {
      await publishContent("homepage", key);
    }
    setSaving(false);
    toast.success("All homepage content published!");
  };

  if (loading) return <div className="text-muted-foreground p-4">Loading...</div>;

  const sections = [
    { id: "hero", label: "Hero" },
    { id: "problem", label: "Problem" },
    { id: "services_header", label: "Services Section" },
    { id: "process", label: "Process" },
    { id: "portfolio_header", label: "Portfolio Section" },
    { id: "whychoose", label: "Why Choose Us" },
    { id: "testimonials", label: "Testimonials" },
    { id: "cta", label: "CTA" },
    { id: "contact_header", label: "Contact Section" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-heading text-lg font-semibold text-foreground">Homepage Content</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
            <span className="ml-1.5">{previewMode ? "Edit" : "Preview"}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span className="ml-1.5">Save Changes</span>
          </Button>
          <Button variant="hero" size="sm" onClick={handlePublishAll} disabled={saving}>
            Publish Changes
          </Button>
        </div>
      </div>

      {/* Section tabs */}
      {!previewMode && (
        <div className="flex flex-wrap gap-1.5">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeSection === s.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {previewMode ? (
        <div className="border border-border rounded-xl p-6 bg-muted/30 space-y-4 max-h-[600px] overflow-y-auto">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Full Homepage Preview</h4>
          {/* Hero */}
          <div className="bg-card rounded-xl p-5 shadow-card">
            <p className="text-xs text-muted-foreground mb-1">Hero</p>
            <p className="text-[10px] text-muted-foreground/60 mb-2">{heroBadge}</p>
            <h1 className="font-heading text-xl font-bold text-foreground">{heroHeadline}</h1>
            <p className="text-muted-foreground text-sm mt-1">{heroDesc}</p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">{heroBtn1}</span>
              <span className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium">{heroBtn2}</span>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {features.map((f, i) => <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">✓ {f}</span>)}
            </div>
            <div className="flex gap-4 mt-3">
              {heroStats.map((s, i) => <span key={i} className="text-xs text-muted-foreground"><strong className="text-foreground">{s.value}</strong> {s.label}</span>)}
            </div>
          </div>
          {/* Problem */}
          <div className="bg-card rounded-xl p-5 shadow-card">
            <p className="text-xs text-muted-foreground mb-1">Problem Section ({problems.length} items)</p>
            <h2 className="font-heading text-lg font-bold text-foreground">{problemTitle}</h2>
            <p className="text-muted-foreground text-sm">{problemDesc}</p>
          </div>
          {/* Why Choose */}
          <div className="bg-card rounded-xl p-5 shadow-card">
            <p className="text-xs text-muted-foreground mb-1">Why Choose Us ({benefits.length} items)</p>
            <h2 className="font-heading text-lg font-bold text-foreground">{whychooseTitle}</h2>
          </div>
          {/* Process */}
          <div className="bg-card rounded-xl p-5 shadow-card">
            <p className="text-xs text-muted-foreground mb-1">Process ({processSteps.length} steps)</p>
            <h2 className="font-heading text-lg font-bold text-foreground">{processTitle}</h2>
          </div>
          {/* CTA */}
          <div className="bg-card rounded-xl p-5 shadow-card">
            <p className="text-xs text-muted-foreground mb-1">CTA Section</p>
            <h2 className="font-heading text-lg font-bold text-foreground">{ctaTitle}</h2>
            <p className="text-muted-foreground text-sm">{ctaDesc}</p>
          </div>
          {/* Testimonials */}
          <div className="bg-card rounded-xl p-5 shadow-card">
            <p className="text-xs text-muted-foreground mb-1">Testimonials ({testimonials.length})</p>
            {testimonials.slice(0, 3).map((t, i) => (
              <div key={i} className="border-l-2 border-primary pl-3 mb-2">
                <p className="text-xs text-muted-foreground italic">"{t.text}"</p>
                <p className="text-[10px] font-medium text-foreground">{t.name} — {t.role}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Hero Section */}
          {activeSection === "hero" && (
            <div className="space-y-4 bg-card border border-border rounded-xl p-5">
              <h4 className="font-heading font-semibold text-foreground text-sm">Hero Section</h4>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Top Badge</label>
                <Input value={heroBadge} onChange={(e) => setHeroBadge(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Headline</label>
                <Input value={heroHeadline} onChange={(e) => setHeroHeadline(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                <Textarea value={heroDesc} onChange={(e) => setHeroDesc(e.target.value)} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Button 1 Text</label>
                  <Input value={heroBtn1} onChange={(e) => setHeroBtn1(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Button 2 Text</label>
                  <Input value={heroBtn2} onChange={(e) => setHeroBtn2(e.target.value)} />
                </div>
              </div>

              <h4 className="font-heading font-semibold text-foreground text-sm pt-2">Feature Badges</h4>
              {features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={f} onChange={(e) => { const u = [...features]; u[i] = e.target.value; setFeatures(u); }} />
                  <Button variant="ghost" size="sm" className="text-destructive shrink-0" onClick={() => setFeatures(features.filter((_, j) => j !== i))}><Trash2 size={14} /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setFeatures([...features, ""])}><Plus size={14} className="mr-1" /> Add Feature</Button>

              <h4 className="font-heading font-semibold text-foreground text-sm pt-2">Stats Bar</h4>
              {heroStats.map((s, i) => (
                <div key={i} className="flex gap-2 items-end">
                  <div className="flex-1"><label className="text-[10px] text-muted-foreground">Value</label><Input value={s.value} onChange={(e) => { const u = [...heroStats]; u[i] = { ...u[i], value: e.target.value }; setHeroStats(u); }} /></div>
                  <div className="flex-1"><label className="text-[10px] text-muted-foreground">Label</label><Input value={s.label} onChange={(e) => { const u = [...heroStats]; u[i] = { ...u[i], label: e.target.value }; setHeroStats(u); }} /></div>
                  <Button variant="ghost" size="sm" className="text-destructive shrink-0" onClick={() => setHeroStats(heroStats.filter((_, j) => j !== i))}><Trash2 size={14} /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setHeroStats([...heroStats, { icon: "Users", value: "", label: "" }])}><Plus size={14} className="mr-1" /> Add Stat</Button>
            </div>
          )}

          {/* Problem Section */}
          {activeSection === "problem" && (
            <div className="space-y-4 bg-card border border-border rounded-xl p-5">
              <h4 className="font-heading font-semibold text-foreground text-sm">Problem Section</h4>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Badge</label><Input value={problemBadge} onChange={(e) => setProblemBadge(e.target.value)} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label><Input value={problemTitle} onChange={(e) => setProblemTitle(e.target.value)} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label><Textarea value={problemDesc} onChange={(e) => setProblemDesc(e.target.value)} rows={2} /></div>
              <h4 className="font-heading font-semibold text-foreground text-sm pt-2">Problem Cards ({problems.length})</h4>
              {problems.map((p, i) => (
                <div key={i} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={p.title} onChange={(e) => { const u = [...problems]; u[i] = { ...u[i], title: e.target.value }; setProblems(u); }} placeholder="Title" />
                    <div className="flex gap-2">
                      <Input value={p.stat} onChange={(e) => { const u = [...problems]; u[i] = { ...u[i], stat: e.target.value }; setProblems(u); }} placeholder="Stat" />
                      <Input value={p.statLabel} onChange={(e) => { const u = [...problems]; u[i] = { ...u[i], statLabel: e.target.value }; setProblems(u); }} placeholder="Stat label" />
                    </div>
                  </div>
                  <Textarea value={p.desc} onChange={(e) => { const u = [...problems]; u[i] = { ...u[i], desc: e.target.value }; setProblems(u); }} rows={2} placeholder="Description" />
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setProblems(problems.filter((_, j) => j !== i))}>Remove</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setProblems([...problems, { icon: "Search", title: "", desc: "", stat: "", statLabel: "" }])}><Plus size={14} className="mr-1" /> Add Problem</Button>
            </div>
          )}

          {/* Services Section Header */}
          {activeSection === "services_header" && (
            <div className="space-y-4 bg-card border border-border rounded-xl p-5">
              <h4 className="font-heading font-semibold text-foreground text-sm">Services Section (Homepage)</h4>
              <p className="text-xs text-muted-foreground">Edit the heading text for the services section on the homepage. To edit individual services, use the Services tab.</p>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Badge</label><Input value={servicesBadge} onChange={(e) => setServicesBadge(e.target.value)} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label><Input value={servicesTitle} onChange={(e) => setServicesTitle(e.target.value)} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label><Textarea value={servicesDesc} onChange={(e) => setServicesDesc(e.target.value)} rows={2} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Button Text</label><Input value={servicesBtn} onChange={(e) => setServicesBtn(e.target.value)} /></div>
            </div>
          )}

          {/* Process Section */}
          {activeSection === "process" && (
            <div className="space-y-4 bg-card border border-border rounded-xl p-5">
              <h4 className="font-heading font-semibold text-foreground text-sm">Process Section</h4>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Badge</label><Input value={processBadge} onChange={(e) => setProcessBadge(e.target.value)} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label><Input value={processTitle} onChange={(e) => setProcessTitle(e.target.value)} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label><Textarea value={processDesc} onChange={(e) => setProcessDesc(e.target.value)} rows={2} /></div>
              <h4 className="font-heading font-semibold text-foreground text-sm pt-2">Steps ({processSteps.length})</h4>
              {processSteps.map((s, i) => (
                <div key={i} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={s.title} onChange={(e) => { const u = [...processSteps]; u[i] = { ...u[i], title: e.target.value }; setProcessSteps(u); }} placeholder="Title" />
                    <Input value={s.step} onChange={(e) => { const u = [...processSteps]; u[i] = { ...u[i], step: e.target.value }; setProcessSteps(u); }} placeholder="Step number" />
                  </div>
                  <Textarea value={s.desc} onChange={(e) => { const u = [...processSteps]; u[i] = { ...u[i], desc: e.target.value }; setProcessSteps(u); }} rows={2} placeholder="Description" />
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setProcessSteps(processSteps.filter((_, j) => j !== i))}>Remove</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setProcessSteps([...processSteps, { icon: "MessageSquare", step: String(processSteps.length + 1).padStart(2, "0"), title: "", desc: "" }])}><Plus size={14} className="mr-1" /> Add Step</Button>

              <h4 className="font-heading font-semibold text-foreground text-sm pt-3">Process CTA Card</h4>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">CTA Title</label><Input value={processCtaTitle} onChange={(e) => setProcessCtaTitle(e.target.value)} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">CTA Description</label><Textarea value={processCtaDesc} onChange={(e) => setProcessCtaDesc(e.target.value)} rows={2} /></div>
              {processCtaBadges.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={b} onChange={(e) => { const u = [...processCtaBadges]; u[i] = e.target.value; setProcessCtaBadges(u); }} />
                  <Button variant="ghost" size="sm" className="text-destructive shrink-0" onClick={() => setProcessCtaBadges(processCtaBadges.filter((_, j) => j !== i))}><Trash2 size={14} /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setProcessCtaBadges([...processCtaBadges, ""])}><Plus size={14} className="mr-1" /> Add Badge</Button>
            </div>
          )}

          {/* Portfolio Section Header */}
          {activeSection === "portfolio_header" && (
            <div className="space-y-4 bg-card border border-border rounded-xl p-5">
              <h4 className="font-heading font-semibold text-foreground text-sm">Portfolio Section (Homepage)</h4>
              <p className="text-xs text-muted-foreground">Edit headings for the portfolio section on the homepage. To edit individual projects, use the Portfolio tab.</p>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Badge</label><Input value={portfolioBadge} onChange={(e) => setPortfolioBadge(e.target.value)} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label><Input value={portfolioTitle} onChange={(e) => setPortfolioTitle(e.target.value)} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label><Textarea value={portfolioDesc} onChange={(e) => setPortfolioDesc(e.target.value)} rows={2} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Button Text</label><Input value={portfolioBtn} onChange={(e) => setPortfolioBtn(e.target.value)} /></div>
            </div>
          )}

          {/* Why Choose Us */}
          {activeSection === "whychoose" && (
            <div className="space-y-4 bg-card border border-border rounded-xl p-5">
              <h4 className="font-heading font-semibold text-foreground text-sm">Why Choose Us Section</h4>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Badge</label><Input value={whychooseBadge} onChange={(e) => setWhychooseBadge(e.target.value)} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label><Input value={whychooseTitle} onChange={(e) => setWhychooseTitle(e.target.value)} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label><Textarea value={whychooseDesc} onChange={(e) => setWhychooseDesc(e.target.value)} rows={2} /></div>
              <h4 className="font-heading font-semibold text-foreground text-sm pt-2">Benefit Cards ({benefits.length})</h4>
              {benefits.map((b, i) => (
                <div key={i} className="border border-border rounded-lg p-3 space-y-2">
                  <Input value={b.title} onChange={(e) => { const u = [...benefits]; u[i] = { ...u[i], title: e.target.value }; setBenefits(u); }} placeholder="Title" />
                  <Textarea value={b.desc} onChange={(e) => { const u = [...benefits]; u[i] = { ...u[i], desc: e.target.value }; setBenefits(u); }} rows={2} placeholder="Description" />
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setBenefits(benefits.filter((_, j) => j !== i))}>Remove</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setBenefits([...benefits, { icon: "Shield", title: "", desc: "" }])}><Plus size={14} className="mr-1" /> Add Benefit</Button>
            </div>
          )}

          {/* Testimonials */}
          {activeSection === "testimonials" && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              <h4 className="font-heading font-semibold text-foreground text-sm">Testimonials ({testimonials.length})</h4>
              {testimonials.map((t, i) => (
                <div key={i} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Input value={t.name} onChange={(e) => { const u = [...testimonials]; u[i] = { ...u[i], name: e.target.value }; setTestimonials(u); }} placeholder="Name" />
                    <Input value={t.role} onChange={(e) => { const u = [...testimonials]; u[i] = { ...u[i], role: e.target.value }; setTestimonials(u); }} placeholder="Role" />
                    <Input value={t.business || ""} onChange={(e) => { const u = [...testimonials]; u[i] = { ...u[i], business: e.target.value }; setTestimonials(u); }} placeholder="Business" />
                  </div>
                  <Textarea value={t.text} onChange={(e) => { const u = [...testimonials]; u[i] = { ...u[i], text: e.target.value }; setTestimonials(u); }} rows={2} placeholder="Testimonial text" />
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))}>Remove</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setTestimonials([...testimonials, { name: "", role: "", business: "", text: "" }])}><Plus size={14} className="mr-1" /> Add Testimonial</Button>
            </div>
          )}

          {/* CTA Section */}
          {activeSection === "cta" && (
            <div className="space-y-4 bg-card border border-border rounded-xl p-5">
              <h4 className="font-heading font-semibold text-foreground text-sm">CTA Section</h4>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label><Input value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label><Textarea value={ctaDesc} onChange={(e) => setCtaDesc(e.target.value)} rows={2} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Button 1</label><Input value={ctaBtn1} onChange={(e) => setCtaBtn1(e.target.value)} /></div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Button 2</label><Input value={ctaBtn2} onChange={(e) => setCtaBtn2(e.target.value)} /></div>
              </div>
              <h4 className="font-heading font-semibold text-foreground text-sm pt-2">CTA Badges</h4>
              {ctaBadges.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={b} onChange={(e) => { const u = [...ctaBadges]; u[i] = e.target.value; setCtaBadges(u); }} />
                  <Button variant="ghost" size="sm" className="text-destructive shrink-0" onClick={() => setCtaBadges(ctaBadges.filter((_, j) => j !== i))}><Trash2 size={14} /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setCtaBadges([...ctaBadges, ""])}><Plus size={14} className="mr-1" /> Add Badge</Button>
            </div>
          )}

          {/* Contact Section Header */}
          {activeSection === "contact_header" && (
            <div className="space-y-4 bg-card border border-border rounded-xl p-5">
              <h4 className="font-heading font-semibold text-foreground text-sm">Contact Section (Homepage)</h4>
              <p className="text-xs text-muted-foreground">Edit headings for the contact section on the homepage. To edit contact details (email, phone), use the Contact tab.</p>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Badge</label><Input value={contactBadge} onChange={(e) => setContactBadge(e.target.value)} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label><Input value={contactTitle} onChange={(e) => setContactTitle(e.target.value)} /></div>
              <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label><Textarea value={contactDesc} onChange={(e) => setContactDesc(e.target.value)} rows={2} /></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomepageEditor;
