import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("exit_popup_shown");
    if (shown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) {
        setShow(true);
        sessionStorage.setItem("exit_popup_shown", "true");
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    // Delay adding listener to avoid triggering on page load
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-[80]"
            onClick={() => setShow(false)}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[81] w-[420px] max-w-[calc(100vw-32px)] rounded-2xl border border-border bg-card shadow-hero p-6 sm:p-8 text-center"
          >
            <button
              onClick={() => setShow(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-1"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CalendarDays size={24} className="text-primary" />
            </div>

            <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2">
              Before You Leave...
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 leading-relaxed">
              Would you like to discuss building a website for your business? Schedule a free consultation with us.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" className="gap-2" asChild>
                <a href="/book-meeting" onClick={() => setShow(false)}>
                  <CalendarDays size={16} />
                  Book a Schedule
                </a>
              </Button>
              <Button variant="outline" className="gap-2" asChild>
                <a href="/contact" onClick={() => setShow(false)}>
                  <Mail size={16} />
                  Contact Us
                </a>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
