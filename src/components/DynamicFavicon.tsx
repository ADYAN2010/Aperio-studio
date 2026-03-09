import { useEffect } from "react";
import { usePublishedContent } from "@/hooks/usePublishedContent";

/**
 * Reads the published favicon_url from CMS and updates the browser tab icon dynamically.
 * Falls back to the default /favicon.png if no custom favicon is published.
 */
const DynamicFavicon = () => {
  const { get, loading } = usePublishedContent("images");

  useEffect(() => {
    if (loading) return;
    const faviconUrl = get("favicon_url") as string | undefined;
    if (!faviconUrl) return;

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
    link.type = faviconUrl.endsWith(".svg")
      ? "image/svg+xml"
      : faviconUrl.endsWith(".ico")
        ? "image/x-icon"
        : "image/png";
  }, [get, loading]);

  return null;
};

export default DynamicFavicon;
