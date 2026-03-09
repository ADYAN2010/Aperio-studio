import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PromoResult {
  valid: boolean;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  code?: string;
  message: string;
}

export function usePromoCode() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PromoResult | null>(null);

  const applyCode = async (code: string) => {
    if (!code.trim()) {
      setResult({ valid: false, message: "Please enter a code" });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      setResult({ valid: false, message: "This promo code has expired or reached its usage limit." });
      setLoading(false);
      return;
    }

    // Check expiration
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setResult({ valid: false, message: "This promo code has expired or reached its usage limit." });
      setLoading(false);
      return;
    }

    // Check max uses
    if (data.max_uses && data.usage_count >= data.max_uses) {
      setResult({ valid: false, message: "This promo code has expired or reached its usage limit." });
      setLoading(false);
      return;
    }

    setResult({
      valid: true,
      discountType: data.discount_type as "percentage" | "fixed",
      discountValue: Number(data.discount_value),
      code: data.code,
      message: `Code applied! ${data.discount_type === "percentage" ? `${data.discount_value}% off` : `৳${Number(data.discount_value).toLocaleString()} off`}`,
    });
    setLoading(false);
  };

  const consumeCode = async (code: string): Promise<boolean> => {
    const { data, error } = await supabase.rpc("consume_promo_code", { _code: code } as any);
    if (error) return false;
    const res = data as any;
    return res?.success === true;
  };

  const clearCode = () => setResult(null);

  const getDiscountedPrice = (originalPrice: number) => {
    if (!result?.valid) return originalPrice;
    if (result.discountType === "percentage") {
      return Math.round(originalPrice * (1 - (result.discountValue! / 100)));
    }
    return Math.max(0, originalPrice - result.discountValue!);
  };

  return { applyCode, clearCode, consumeCode, result, loading, getDiscountedPrice };
}
