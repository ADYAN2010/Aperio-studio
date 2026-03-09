import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeBubbleProps {
  onOpenChat: () => void;
}

const WelcomeBubble = ({ onOpenChat }: WelcomeBubbleProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("welcome_dismissed");
    if (dismissed) return;

    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("welcome_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="fixed bottom-[140px] right-6 z-[65] w-[300px] max-w-[calc(100vw-48px)] rounded-2xl border border-border bg-card shadow-hero p-4"
        >
          <button
            onClick={dismiss}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground p-1"
            aria-label="Close"
          >
            <X size={14} />
          </button>
          <p className="text-sm text-foreground mb-3 pr-4 leading-relaxed">
            👋 Hi there! Need a website for your business? You can book a schedule or chat with us.
          </p>
          <div className="flex gap-2">
            <Button variant="hero" size="sm" className="gap-1.5 text-xs flex-1" asChild>
              <a href="/book-meeting" onClick={dismiss}>
                <CalendarDays size={14} />
                Book a Schedule
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs flex-1"
              onClick={() => { dismiss(); onOpenChat(); }}
            >
              <MessageCircle size={14} />
              Open Chat
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeBubble;
