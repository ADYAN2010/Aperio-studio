import { useState } from "react";
import Navbar from "@/components/Navbar";
import { usePublishedContent } from "@/hooks/usePublishedContent";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { CalendarDays, Clock, CheckCircle2, Ticket, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { usePromoCode } from "@/hooks/usePromoCode";

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM",
];

const websiteTypes = [
  "Business Website",
  "E-commerce Website",
  "Portfolio Website",
  "Website Redesign",
];

const BookMeeting = () => {
  const { get } = usePublishedContent("booking");
  const bookingHeadline = get("headline", "Book a Meeting With Aperio Studios");
  const bookingDescription = get("description", "Schedule a consultation to discuss your business website.");
  const bookingInstructions = get("instructions", "Select a date and time, fill in your details, and confirm your booking. We'll reach out to you before the meeting.");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const { applyCode, clearCode, consumeCode, result: promoResult, loading: promoLoading } = usePromoCode();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    business_name: "",
    website_type: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) { toast.error("Please select a date."); return; }
    if (!selectedTime) { toast.error("Please select a time slot."); return; }
    if (!form.name.trim() || !form.email.trim()) { toast.error("Name and email are required."); return; }
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length < 10 || phoneDigits.length > 15) {
      toast.error("Please enter a valid phone number (10–15 digits).");
      return;
    }

    setLoading(true);

    const appliedCode = promoResult?.valid ? promoResult.code : null;

    const { error } = await supabase.from("bookings").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      business_name: form.business_name.trim(),
      website_type: form.website_type,
      message: form.message.trim(),
      meeting_date: format(selectedDate, "yyyy-MM-dd"),
      meeting_time: selectedTime,
      promo_code: appliedCode,
    } as any);

    if (error) {
      toast.error("Failed to book meeting. Please try again.");
      setLoading(false);
      return;
    }

    // Consume the promo code after successful booking
    if (appliedCode) {
      const consumed = await consumeCode(appliedCode);
      if (!consumed) {
        toast.warning("Booking confirmed, but promo code could not be applied.");
      }
    }

    setSubmitted(true);
    setLoading(false);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="Book a Meeting" description="Schedule a free consultation with Aperio Studios to discuss your website project." path="/book-meeting" />
        <Navbar />
        <section className="pt-36 sm:pt-40 md:pt-44 lg:pt-48 pb-14 sm:pb-16 md:pb-20 bg-gradient-hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-card">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} className="text-primary" />
                </div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
                  Meeting Scheduled!
                </h1>
                <p className="text-muted-foreground mb-2">
                  Your meeting has been scheduled successfully.
                </p>
                <p className="text-muted-foreground text-sm mb-6">
                  Our team will contact you shortly.
                </p>
                <div className="rounded-xl bg-muted/50 p-4 mb-6 text-sm">
                  <p className="text-foreground font-medium">
                    {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </p>
                  <p className="text-primary font-semibold">{selectedTime}</p>
                  {promoResult?.valid && (
                    <p className="text-green-600 dark:text-green-400 text-xs mt-2">
                      🎉 Promo code {promoResult.code} applied — {promoResult.message.replace("Code applied! ", "")}
                    </p>
                  )}
                </div>
                <Button variant="hero" asChild>
                  <a href="/">Back to Home</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Book a Meeting" description="Schedule a free consultation with Aperio Studios to discuss your website project." path="/book-meeting" />
      <Navbar />
      <section className="pt-36 sm:pt-40 md:pt-44 lg:pt-48 pb-14 sm:pb-16 md:pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CalendarDays size={24} className="text-primary" />
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
              {bookingHeadline.includes("Aperio Studios") ? (
                <>
                  Book a Meeting With <span className="text-gradient">Aperio Studios</span>
                </>
              ) : (
                bookingHeadline
              )}
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              {bookingDescription}
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Calendar + Time */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  {/* Calendar */}
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                    <h2 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <CalendarDays size={18} className="text-primary" />
                      Select Date
                    </h2>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < today || date.getDay() === 0 || date.getDay() === 6}
                      className={cn("p-3 pointer-events-auto rounded-xl")}
                    />
                  </div>

                  {/* Time Slots */}
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                    <h2 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Clock size={18} className="text-primary" />
                      Select Time
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border touch-manipulation",
                            selectedTime === time
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Right: Form */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card h-fit"
                >
                  <h2 className="font-heading text-lg font-bold text-foreground mb-5">Your Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Name <span className="text-destructive">*</span></label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required maxLength={100} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email <span className="text-destructive">*</span></label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required maxLength={255} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition" placeholder="you@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number <span className="text-destructive">*</span></label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} required maxLength={20} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition" placeholder="+880 1XXX-XXXXXX" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Business Name</label>
                      <input type="text" name="business_name" value={form.business_name} onChange={handleChange} maxLength={100} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition" placeholder="Your business" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Type of Website Needed</label>
                      <select name="website_type" value={form.website_type} onChange={handleChange} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition">
                        <option value="">Select a type</option>
                        {websiteTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Message <span className="text-muted-foreground text-xs">(optional)</span></label>
                      <textarea name="message" value={form.message} onChange={handleChange} maxLength={1000} rows={3} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none" placeholder="Tell us about your project..." />
                    </div>

                    {/* Promo Code */}
                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Ticket size={16} className="text-primary" />
                        <label className="text-sm font-medium text-foreground">Promo Code</label>
                      </div>
                      {promoResult?.valid ? (
                        <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                          <span className="text-green-700 dark:text-green-400 text-sm font-medium">{promoResult.message}</span>
                          <button type="button" onClick={clearCode} className="text-green-600 hover:text-green-800 dark:hover:text-green-300">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={promoInput}
                              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCode(promoInput))}
                              placeholder="Enter code"
                              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono uppercase tracking-wider text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                            />
                            <Button
                              type="button"
                              variant="heroOutline"
                              size="sm"
                              onClick={() => applyCode(promoInput)}
                              disabled={promoLoading}
                              className="shrink-0"
                            >
                              {promoLoading ? "..." : "Apply"}
                            </Button>
                          </div>
                          {promoResult && !promoResult.valid && (
                            <p className="text-destructive text-xs mt-1.5">{promoResult.message}</p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Selection summary */}
                    {(selectedDate || selectedTime) && (
                      <div className="rounded-xl bg-muted/50 p-3.5 border border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Selected Schedule</p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedDate ? format(selectedDate, "EEEE, MMM d, yyyy") : "No date selected"}
                          {selectedTime && ` · ${selectedTime}`}
                        </p>
                      </div>
                    )}

                    <Button type="submit" variant="hero" size="lg" className="w-full gap-2 touch-manipulation" disabled={loading}>
                      <CalendarDays size={18} />
                      {loading ? "Booking..." : "Confirm Booking"}
                    </Button>
                  </div>
                </motion.div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BookMeeting;
