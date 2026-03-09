import AdminLayout from "@/components/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Briefcase, FolderOpen, DollarSign, Navigation, Image as ImageIcon, Info, Mail, CalendarDays, Settings, Crown } from "lucide-react";
import HomepageEditor from "@/components/cms/HomepageEditor";
import ServicesEditor from "@/components/cms/ServicesEditor";
import PortfolioEditor from "@/components/cms/PortfolioEditor";
import PricingEditor from "@/components/cms/PricingEditor";
import NavbarFooterEditor from "@/components/cms/NavbarFooterEditor";
import ImagesEditor from "@/components/cms/ImagesEditor";
import AboutEditor from "@/components/cms/AboutEditor";
import ContactEditor from "@/components/cms/ContactEditor";
import BookingEditor from "@/components/cms/BookingEditor";
import DesignSettingsEditor from "@/components/cms/DesignSettingsEditor";
import LogoEditor from "@/components/cms/LogoEditor";

const tabs = [
  { value: "homepage", label: "Homepage", icon: Home },
  { value: "logo", label: "Brand Logo", icon: Crown },
  { value: "services", label: "Services", icon: Briefcase },
  { value: "portfolio", label: "Portfolio", icon: FolderOpen },
  { value: "pricing", label: "Pricing", icon: DollarSign },
  { value: "about", label: "About", icon: Info },
  { value: "contact", label: "Contact", icon: Mail },
  { value: "booking", label: "Booking", icon: CalendarDays },
  { value: "navigation", label: "Nav & Footer", icon: Navigation },
  { value: "design", label: "Design", icon: Settings },
  { value: "images", label: "Media", icon: ImageIcon },
];

const AdminWebsiteEditor = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Website Editor</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Edit your website content, save as draft, and publish when ready. All changes appear on the live site after publishing.
          </p>
        </div>

        <Tabs defaultValue="homepage" className="w-full">
          <TabsList className="flex flex-wrap gap-1 bg-muted/50 p-1 rounded-xl h-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg px-3 py-2"
              >
                <tab.icon size={14} />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            <TabsContent value="homepage"><HomepageEditor /></TabsContent>
            <TabsContent value="logo"><LogoEditor /></TabsContent>
            <TabsContent value="services"><ServicesEditor /></TabsContent>
            <TabsContent value="portfolio"><PortfolioEditor /></TabsContent>
            <TabsContent value="pricing"><PricingEditor /></TabsContent>
            <TabsContent value="about"><AboutEditor /></TabsContent>
            <TabsContent value="contact"><ContactEditor /></TabsContent>
            <TabsContent value="booking"><BookingEditor /></TabsContent>
            <TabsContent value="navigation"><NavbarFooterEditor /></TabsContent>
            <TabsContent value="design"><DesignSettingsEditor /></TabsContent>
            <TabsContent value="images"><ImagesEditor /></TabsContent>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminWebsiteEditor;
