import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="Page Not Found" description="The page you're looking for doesn't exist." path={location.pathname} />
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-28 pb-16">
        <div className="text-center px-4">
          <h1 className="font-heading text-7xl sm:text-8xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-2">Page Not Found</p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button variant="hero" size="lg" className="gap-2" asChild>
            <Link to="/">
              <Home size={18} />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
