import { Megaphone } from "lucide-react";
import { usePublishedContent } from "@/hooks/usePublishedContent";

const defaultMessages = [
  "Book a Schedule to discuss your business website with Aperio Studios",
  "We build modern websites for businesses worldwide",
  "Explore our portfolio to see recent website projects",
  "Need an e-commerce store? Aperio Studios can help",
  "Professional websites — Schedule a consultation today",
  "24/7 support and maintenance for all our website clients",
];

const AnnouncementTicker = () => {
  const { get } = usePublishedContent("design");

  // Match keys from DesignSettingsEditor: announcement_label, announcements
  const label = get("announcement_label", "Update");
  const rawAnnouncements = get("announcements", null);

  // DesignSettingsEditor saves announcements as { text: string }[]
  // Convert to string[] for display
  const messages: string[] = rawAnnouncements
    ? rawAnnouncements.map((a: any) => (typeof a === "string" ? a : a.text || ""))
    : defaultMessages;

  const separator = " ✦ ";
  const content = messages.join(separator) + separator;

  return (
    <div className="w-full bg-gradient-cta text-primary-foreground z-[60] relative overflow-hidden h-9 flex items-center">
      {/* Label */}
      <div className="shrink-0 flex items-center gap-1.5 px-3 sm:px-4 h-full bg-secondary text-secondary-foreground font-heading font-bold text-xs sm:text-sm uppercase tracking-wider z-10">
        <Megaphone size={14} />
        {label}
      </div>

      {/* Scrolling area */}
      <div className="relative flex-1 overflow-hidden h-full flex items-center group">
        <div className="animate-ticker group-hover:[animation-play-state:paused] flex whitespace-nowrap">
          <span className="inline-block text-xs sm:text-sm font-medium pr-2">{content}</span>
          <span className="inline-block text-xs sm:text-sm font-medium pr-2">{content}</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementTicker;
