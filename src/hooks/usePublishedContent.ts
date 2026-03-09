import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches published CMS content for a given section.
 * Returns a map of content_key → content_value for published items only.
 * Used by frontend pages (read-only, no auth required).
 * Supports manual refetch via refetch() for cache-busting after publish.
 */
export const usePublishedContent = (section: string) => {
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const fetchPublished = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_content")
      .select("content_key, content_value")
      .eq("section", section)
      .eq("is_published", true);

    if (!error && data) {
      const map: Record<string, any> = {};
      for (const row of data as any[]) {
        map[row.content_key] = row.content_value;
      }
      setContent(map);
    }
    setLoading(false);
  }, [section]);

  useEffect(() => {
    fetchPublished();
  }, [fetchPublished]);

  // Subscribe to realtime changes for instant updates after publish
  useEffect(() => {
    const channel = supabase
      .channel(`published-${section}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_content',
          filter: `section=eq.${section}`,
        },
        () => {
          // Refetch when any content in this section changes
          fetchPublished();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [section, fetchPublished]);

  const get = (key: string, fallback?: any) => content[key] ?? fallback;

  return { content, loading, get, refetch: fetchPublished };
};
