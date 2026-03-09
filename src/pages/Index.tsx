// Updated: consultation-based approach
import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import ServicesSection from "@/components/ServicesSection";
import ConsultationSection from "@/components/FreeTemplateSection";
import PortfolioSection from "@/components/PortfolioSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Aperio Studios - Professional Website Development & Design"
        description="Aperio Studios helps businesses build modern, high-performing websites that attract customers. From consultation to launch, we handle everything."
        path="/"
      />
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <ServicesSection />
      <ConsultationSection />
      <PortfolioSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <CTASection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
