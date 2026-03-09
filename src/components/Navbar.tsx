// Navbar component
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import defaultLogo from "@/assets/aperio-logo.png";
import { Button } from "@/components/ui/button";
import { Menu, X, CalendarDays, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import AnnouncementTicker from "./AnnouncementTicker";
import { supabase } from "@/integrations/supabase/client";
import { servicesData } from "@/data/services";
import { usePublishedContent } from "@/hooks/usePublishedContent";
import type { User } from "@supabase/supabase-js";

const defaultNavLinks = [
  { label: "Home", href: "/#home" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const serviceItems = servicesData.map((s) => ({
  label: s.title,
  href: `/services/${s.slug}`,
  Icon: s.icon,
}));

const Navbar = () => {
  const { get } = usePublishedContent("navigation");
  const { get: getImages } = usePublishedContent("images");
  const cmsNavItems: { label: string; href: string }[] | null = get("nav_items", null);
  
  // CMS logo: check images section for a "logo" asset
  const cmsImages: { label: string; url: string; key: string }[] | null = getImages("image_assets", null);
  const cmsLogo = cmsImages?.find((img) => img.key === "site-logo" || img.label.toLowerCase().includes("logo"))?.url;
  const logoSrc = cmsLogo || defaultLogo;
  const brandName = get("brand_name", "Aperio Studios");
  
  // Logo size settings from CMS
  const logoSettings = getImages("logo_settings", null) as { height?: number; width?: number; padding?: number } | null;
  
  // Build navLinks from CMS or defaults, marking Services for dropdown
  const navLinks = (cmsNavItems || defaultNavLinks).map((item) => ({
    ...item,
    hasDropdown: item.href === "/services" || item.label.toLowerCase() === "services",
  }));
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const currentPath = location.pathname + location.search;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const fetchRole = async (userId: string) => {
      const { data } = await supabase.rpc("get_user_role", { _user_id: userId });
      setUserRole(data as string | null);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchRole(session.user.id);
        } else {
          setUserRole(null);
        }
        setAuthLoading(false);
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      }
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close desktop dropdown on route change
  useEffect(() => {
    setDesktopDropdown(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileOpen(false);
    navigate("/");
  };

  const openDropdown = () => {
    clearTimeout(timeoutRef.current);
    setDesktopDropdown(true);
  };

  const closeDropdown = () => {
    timeoutRef.current = setTimeout(() => setDesktopDropdown(false), 150);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <AnnouncementTicker />
      <nav
        className={`transition-all duration-300 ${
          scrolled || mobileOpen
            ? "bg-background/95 backdrop-blur-md shadow-card"
            : "bg-transparent"
        }`}
      >
      <div className="container mx-auto flex items-center justify-between h-16 lg:h-[72px] px-4 sm:px-6 lg:px-8">
        {/* Logo + Brand Name */}
        <a href="/" className="flex items-center gap-2.5 shrink-0 group" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
          <img
            src={logoSrc}
            alt={`${brandName} logo`}
            className={logoSettings?.height ? "w-auto object-contain group-hover:opacity-90 transition-opacity duration-300" : "h-8 sm:h-9 lg:h-10 w-auto object-contain group-hover:opacity-90 transition-opacity duration-300"}
            style={logoSettings?.height ? {
              height: `${logoSettings.height}px`,
              width: logoSettings.width ? `${logoSettings.width}px` : 'auto',
              padding: logoSettings.padding ? `${logoSettings.padding}px` : undefined,
            } : undefined}
            decoding="async"
          />
          <span className="font-heading font-bold text-foreground text-base sm:text-lg lg:text-xl tracking-tight group-hover:text-primary transition-colors duration-300">
            {brandName}
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div
                key={link.href}
                className="relative"
                ref={dropdownRef}
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                <button
                  className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-all duration-200"
                  onClick={() => navigate("/services")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setDesktopDropdown((v) => !v);
                    }
                    if (e.key === "Escape") setDesktopDropdown(false);
                  }}
                  aria-expanded={desktopDropdown}
                  aria-haspopup="true"
                >
                  {link.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${desktopDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {desktopDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
                      role="menu"
                      onMouseEnter={openDropdown}
                      onMouseLeave={closeDropdown}
                    >
                      <div className="p-2">
                        {serviceItems.map(({ label, href, Icon }) => (
                          <a
                            key={href}
                            href={href}
                            role="menuitem"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-150"
                            onClick={(e) => {
                              e.preventDefault();
                              setDesktopDropdown(false);
                              navigate(href);
                            }}
                          >
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary shrink-0">
                              <Icon size={16} />
                            </span>
                            {label}
                          </a>
                        ))}
                        <div className="border-t border-border mt-1 pt-1">
                          <a
                            href="/services"
                            role="menuitem"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors duration-150"
                            onClick={(e) => {
                              e.preventDefault();
                              setDesktopDropdown(false);
                              navigate("/services");
                            }}
                          >
                            View All Services →
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-all duration-200"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* Desktop right buttons */}
        <div className="hidden lg:flex items-center gap-2.5">
          <ThemeToggle />
          {authLoading ? (
            <div className="w-48" />
          ) : user ? (
            <>
              <Button variant="outline" size="sm" className="gap-2 border-border hover:border-primary/40 hover:text-primary" asChild>
                <a href={userRole === "admin" ? "/admin-dashboard" : "/dashboard"}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </a>
              </Button>
              <Button variant="hero" size="sm" className="gap-2 shadow-sm hover:shadow-md transition-shadow" asChild>
                <a href="/book-meeting">
                  <CalendarDays size={16} />
                  Book a Schedule
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => navigate("/login", { state: { returnTo: currentPath } })}>
                Login
              </Button>
              <Button variant="outline" size="sm" className="border-border hover:border-primary/40 hover:text-primary" onClick={() => navigate("/signup", { state: { returnTo: currentPath } })}>
                Sign Up
              </Button>
              <Button variant="hero" size="sm" className="gap-2 shadow-sm hover:shadow-md transition-shadow" asChild>
                <a href="/book-meeting">
                  <CalendarDays size={16} />
                  Book a Meeting
                </a>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground p-2 -mr-2 touch-manipulation rounded-lg hover:bg-muted/60 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-1">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div key={link.href}>
                    <button
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      className="flex items-center justify-between w-full text-base font-medium text-foreground hover:text-primary py-3 px-3 rounded-xl hover:bg-muted/60 transition-colors touch-manipulation"
                      aria-expanded={mobileServicesOpen}
                    >
                      {link.label}
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pl-3 pb-1 flex flex-col gap-0.5">
                            {serviceItems.map(({ label, href, Icon }) => (
                              <a
                                key={href}
                                href={href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setMobileOpen(false);
                                  navigate(href);
                                }}
                                className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors touch-manipulation"
                              >
                                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary shrink-0">
                                  <Icon size={14} />
                                </span>
                                {label}
                              </a>
                            ))}
                            <a
                              href="/services"
                              onClick={(e) => {
                                e.preventDefault();
                                setMobileOpen(false);
                                navigate("/services");
                              }}
                              className="py-2.5 px-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors touch-manipulation"
                            >
                              View All Services →
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-medium text-foreground hover:text-primary py-3 px-3 rounded-xl hover:bg-muted/60 transition-colors touch-manipulation"
                  >
                    {link.label}
                  </a>
                )
              )}
              <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2.5">
                <ThemeToggle className="w-full" />
                {!authLoading && user ? (
                  <>
                    <Button variant="outline" size="lg" className="w-full gap-2" asChild>
                      <a href={userRole === "admin" ? "/admin-dashboard" : "/dashboard"} onClick={() => setMobileOpen(false)}>
                        <LayoutDashboard size={18} />
                        Dashboard
                      </a>
                    </Button>
                    <Button variant="hero" size="lg" className="w-full gap-2" asChild>
                      <a href="/book-meeting" onClick={() => setMobileOpen(false)}>
                        <CalendarDays size={18} />
                        Book a Schedule
                      </a>
                    </Button>
                    <Button variant="ghost" size="lg" className="w-full gap-2 text-muted-foreground hover:text-destructive" onClick={handleLogout}>
                      <LogOut size={18} />
                      Logout
                    </Button>
                  </>
                ) : !authLoading ? (
                  <>
                    <Button variant="hero" size="lg" className="w-full gap-2" asChild>
                      <a href="/book-meeting" onClick={() => setMobileOpen(false)}>
                        <CalendarDays size={18} />
                        Book a Meeting
                      </a>
                    </Button>
                    <div className="flex gap-2.5">
                      <Button variant="outline" size="lg" className="flex-1" onClick={() => { setMobileOpen(false); navigate("/login", { state: { returnTo: currentPath } }); }}>
                        Login
                      </Button>
                      <Button variant="hero" size="lg" className="flex-1" onClick={() => { setMobileOpen(false); navigate("/signup", { state: { returnTo: currentPath } }); }}>
                        Sign Up
                      </Button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;
