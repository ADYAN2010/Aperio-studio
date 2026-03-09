import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ContentItem {
  id: string;
  section: string;
  content_key: string;
  content_value: any;
  is_published: boolean;
  updated_at: string;
}

export const useSiteContent = (section?: string) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("site_content").select("*");
    if (section) query = query.eq("section", section);
    const { data, error } = await query.order("content_key");
    if (error) {
      console.error("Error fetching content:", error);
    } else {
      setContent((data as unknown as ContentItem[]) || []);
    }
    setLoading(false);
  }, [section]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const upsertContent = async (
    sectionName: string,
    key: string,
    value: any,
    publish = false
  ) => {
    const { error } = await supabase.from("site_content").upsert(
      {
        section: sectionName,
        content_key: key,
        content_value: value,
        is_published: publish,
        updated_at: new Date().toISOString(),
      } as any,
      { onConflict: "section,content_key" }
    );
    if (error) {
      toast.error("Failed to save: " + error.message);
      return false;
    }
    toast.success("Content saved successfully");
    await fetchContent();
    return true;
  };

  const publishContent = async (sectionName: string, key: string) => {
    const { error } = await supabase
      .from("site_content")
      .update({ is_published: true, updated_at: new Date().toISOString() } as any)
      .eq("section", sectionName)
      .eq("content_key", key);
    if (error) {
      toast.error("Failed to publish: " + error.message);
      return false;
    }
    toast.success("Content published!");
    await fetchContent();
    return true;
  };

  const unpublishContent = async (sectionName: string, key: string) => {
    const { error } = await supabase
      .from("site_content")
      .update({ is_published: false, updated_at: new Date().toISOString() } as any)
      .eq("section", sectionName)
      .eq("content_key", key);
    if (error) {
      toast.error("Failed to unpublish: " + error.message);
      return false;
    }
    toast.success("Content unpublished");
    await fetchContent();
    return true;
  };

  const deleteContent = async (sectionName: string, key: string) => {
    const { error } = await supabase
      .from("site_content")
      .delete()
      .eq("section", sectionName)
      .eq("content_key", key);
    if (error) {
      toast.error("Failed to delete: " + error.message);
      return false;
    }
    toast.success("Content deleted");
    await fetchContent();
    return true;
  };

  const getContent = (key: string): any => {
    const item = content.find((c) => c.content_key === key);
    return item?.content_value ?? null;
  };

  const getItem = (key: string): ContentItem | undefined => {
    return content.find((c) => c.content_key === key);
  };

  return {
    content,
    loading,
    fetchContent,
    upsertContent,
    publishContent,
    unpublishContent,
    deleteContent,
    getContent,
    getItem,
  };
};

export const uploadCmsImage = async (file: File, path: string): Promise<string | null> => {
  const { error } = await supabase.storage
    .from("cms-images")
    .upload(path, file, { upsert: true });
  if (error) {
    toast.error("Upload failed: " + error.message);
    return null;
  }
  const { data } = supabase.storage.from("cms-images").getPublicUrl(path);
  return data.publicUrl;
};
