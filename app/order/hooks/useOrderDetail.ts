import { getOrderById } from "@/lib/database-helpers";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types/database";
import { OrderDetail } from "@/lib/types/order";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { mapOrderResponse, mapProductFallback } from "../utils/mapOrderResponse";

export function useOrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadOrder = useCallback(async () => {
    if (!id) return;
    try {
      const result = await getOrderById(id);
      if (result.success && result.data) {
        setOrder(mapOrderResponse(result.data as any, result.order_items || []));
      } else {
        const { data: product, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();
        if (!error && product) setOrder(mapProductFallback(product as Product));
      }
    } catch (err) {
      console.error("Error loading order:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
    loadOrder();
  }, [loadOrder]);

  return { order, loading, refreshing, refreshTrigger, loadOrder, onRefresh };
}
