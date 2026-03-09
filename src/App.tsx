import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import PageTransition from "./components/PageTransition";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Portfolio from "./pages/Portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import BookMeeting from "./pages/BookMeeting";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMessages from "./pages/AdminMessages";
import AdminUsers from "./pages/AdminUsers";
import AdminBookings from "./pages/AdminBookings";
import AdminWebsiteEditor from "./pages/AdminWebsiteEditor";
import UserDashboard from "./pages/UserDashboard";
import UserRequests from "./pages/UserRequests";
import UserSupport from "./pages/UserSupport";
import UserSettings from "./pages/UserSettings";
import NotFound from "./pages/NotFound";
import AdminChat from "./pages/AdminChat";
import AdminPromoCodes from "./pages/AdminPromoCodes";
import EngagementWidgets from "./components/EngagementWidgets";
import DynamicFavicon from "./components/DynamicFavicon";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <>
    <ScrollToTop />
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/services/:slug" element={<PageTransition><ServiceDetail /></PageTransition>} />
        <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
        <Route path="/portfolio/:slug" element={<PageTransition><ProjectDetail /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><SignUp /></PageTransition>} />
        <Route path="/admin-login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/book-meeting" element={<PageTransition><BookMeeting /></PageTransition>} />
        <Route path="/admin-dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="/admin-dashboard/messages" element={<PageTransition><AdminMessages /></PageTransition>} />
        <Route path="/admin-dashboard/bookings" element={<PageTransition><AdminBookings /></PageTransition>} />
        <Route path="/admin-dashboard/editor" element={<PageTransition><AdminWebsiteEditor /></PageTransition>} />
        <Route path="/admin-dashboard/chat" element={<PageTransition><AdminChat /></PageTransition>} />
        <Route path="/admin-dashboard/users" element={<PageTransition><AdminUsers /></PageTransition>} />
        <Route path="/admin-dashboard/promo-codes" element={<PageTransition><AdminPromoCodes /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><UserDashboard /></PageTransition>} />
        <Route path="/dashboard/requests" element={<PageTransition><UserRequests /></PageTransition>} />
        <Route path="/dashboard/support" element={<PageTransition><UserSupport /></PageTransition>} />
        <Route path="/dashboard/settings" element={<PageTransition><UserSettings /></PageTransition>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
          <EngagementWidgets />
          <DynamicFavicon />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
