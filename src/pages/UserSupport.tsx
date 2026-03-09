import UserLayout from "@/components/UserLayout";
import { MessageCircle, Mail, MapPin } from "lucide-react";

const UserSupport = () => {
  return (
    <UserLayout>
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">Support</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <a href="https://wa.me/8801XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-border bg-card p-6 shadow-card hover:border-primary/30 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
            <MessageCircle size={22} className="text-success" />
          </div>
          <h3 className="font-heading font-bold text-foreground mb-1">WhatsApp</h3>
          <p className="text-sm text-muted-foreground">Chat with us on WhatsApp for quick support.</p>
        </a>
        <a href="mailto:support@aperiostudios.com" className="rounded-2xl border border-border bg-card p-6 shadow-card hover:border-primary/30 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Mail size={22} className="text-primary" />
          </div>
          <h3 className="font-heading font-bold text-foreground mb-1">Email</h3>
          <p className="text-sm text-muted-foreground">Send us an email and we'll respond within 24 hours.</p>
        </a>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
            <MapPin size={22} className="text-secondary" />
          </div>
          <h3 className="font-heading font-bold text-foreground mb-1">Office</h3>
          <p className="text-sm text-muted-foreground">Visit our office for in-person consultations.</p>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserSupport;
