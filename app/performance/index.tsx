import { ScreenLayout } from "@/components/layouts";
import {
  DailyPerformanceEntry,
  DailyPerformanceList,
  DateRange,
  DateRangeModal,
  GrowthInsightBanner,
  PerformanceMetricGrid,
  PerformanceRevenueCard,
  SellerGrowthMetrics,
  TopSellingItem,
  TopSellingItems,
} from "@/components/performance";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/contexts/AuthContext";
import {
  getOrdersBySeller,
  getProductsByStoreId,
} from "@/lib/database-helpers";
import dayjs, { Dayjs } from "dayjs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { CalendarIcon, ChartBarFillIcon } from "@/components/icons";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface OrderItem {
  id: string;
  earnings: number;
  amount: number;
  shipping_fee: number;
  status: string;
  created_at: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function defaultDateRange(): DateRange {
  return {
    startDate: dayjs().subtract(6, "day"),
    endDate: dayjs(),
    preset: "week",
  };
}

function buildChartData(
  orders: OrderItem[],
  startDate: Dayjs,
  endDate: Dayjs,
): { data: number[]; labels: string[]; highlightIndex: number } {
  const diffDays = endDate.diff(startDate, "day") + 1;

  if (diffDays <= 7) {
    // Daily bars
    const data: number[] = [];
    const labels: string[] = [];
    let highlightIndex = diffDays - 1;
    const today = dayjs();

    for (let i = 0; i < diffDays; i++) {
      const date = startDate.add(i, "day");
      if (date.isSame(today, "day")) highlightIndex = i;
      labels.push(date.format("dd").charAt(0));
      data.push(
        orders
          .filter((o) => dayjs(o.created_at).isSame(date, "day"))
          .reduce((s, o) => s + o.earnings, 0),
      );
    }
    return { data, labels, highlightIndex };
  }

  if (diffDays <= 35) {
    // Weekly bars
    const weeks = Math.ceil(diffDays / 7);
    const data: number[] = [];
    const labels: string[] = [];
    for (let w = 0; w < weeks; w++) {
      const wStart = startDate.add(w * 7, "day");
      const wEnd = wStart.add(6, "day");
      labels.push(`W${w + 1}`);
      data.push(
        orders
          .filter((o) => {
            const d = dayjs(o.created_at);
            return (
              (d.isAfter(wStart, "day") || d.isSame(wStart, "day")) &&
              (d.isBefore(wEnd, "day") || d.isSame(wEnd, "day"))
            );
          })
          .reduce((s, o) => s + o.earnings, 0),
      );
    }
    return { data, labels, highlightIndex: weeks - 1 };
  }

  // Monthly bars
  const months: string[] = [];
  let cursor = startDate.startOf("month");
  while (cursor.isBefore(endDate, "month") || cursor.isSame(endDate, "month")) {
    months.push(cursor.format("YYYY-MM"));
    cursor = cursor.add(1, "month");
  }
  const data = months.map((m) =>
    orders
      .filter((o) => dayjs(o.created_at).format("YYYY-MM") === m)
      .reduce((s, o) => s + o.earnings, 0),
  );
  const labels = months.map((m) => dayjs(m).format("MMM"));
  return { data, labels, highlightIndex: months.length - 1 };
}

function buildDailyEntries(
  orders: OrderItem[],
  startDate: Dayjs,
  endDate: Dayjs,
): DailyPerformanceEntry[] {
  const diffDays = endDate.diff(startDate, "day") + 1;

  if (diffDays <= 31) {
    // Daily breakdown
    const map = new Map<string, { earnings: number; count: number }>();
    for (let i = 0; i < diffDays; i++) {
      const d = startDate.add(i, "day");
      const key = d.format("YYYY-MM-DD");
      const dayOrders = orders.filter((o) =>
        dayjs(o.created_at).isSame(d, "day"),
      );
      const earnings = dayOrders.reduce((s, o) => s + o.earnings, 0);
      if (earnings > 0) {
        map.set(key, { earnings, count: dayOrders.length });
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1].earnings - a[1].earnings)
      .map(([key, val]) => ({
        label: dayjs(key).format("dddd"),
        earnings: val.earnings,
        ordersCount: val.count,
      }));
  }

  // Weekly breakdown for longer ranges
  const weeks = Math.ceil(diffDays / 7);
  const entries: DailyPerformanceEntry[] = [];
  for (let w = 0; w < weeks; w++) {
    const wStart = startDate.add(w * 7, "day");
    const wEnd = wStart.add(6, "day");
    const weekOrders = orders.filter((o) => {
      const d = dayjs(o.created_at);
      return (
        (d.isAfter(wStart, "day") || d.isSame(wStart, "day")) &&
        (d.isBefore(wEnd, "day") || d.isSame(wEnd, "day"))
      );
    });
    const earnings = weekOrders.reduce((s, o) => s + o.earnings, 0);
    if (earnings > 0) {
      entries.push({
        label: `${wStart.format("MMM D")} – ${wEnd.format("MMM D")}`,
        earnings,
        ordersCount: weekOrders.length,
      });
    }
  }
  return entries.sort((a, b) => b.earnings - a.earnings);
}

function buildInsight(
  orders: OrderItem[],
  startDate: Dayjs,
  endDate: Dayjs,
  growthPercent: number,
): string {
  if (orders.length === 0) {
    return "No orders in this period. Try listing more items or sharing your store link to attract buyers.";
  }

  // Find best day of week
  const dayCounts: Record<number, { earnings: number; count: number }> = {};
  orders.forEach((o) => {
    const dow = dayjs(o.created_at).day(); // 0=Sun
    if (!dayCounts[dow]) dayCounts[dow] = { earnings: 0, count: 0 };
    dayCounts[dow].earnings += o.earnings;
    dayCounts[dow].count += 1;
  });

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const bestDay = Object.entries(dayCounts).sort(
    (a, b) => b[1].earnings - a[1].earnings,
  )[0];

  if (growthPercent > 20) {
    return `Great momentum! Revenue is up ${growthPercent.toFixed(0)}% vs last period. ${dayNames[parseInt(bestDay[0])]} is your strongest day — consider launching new listings then.`;
  }
  if (growthPercent < -10) {
    return `Revenue dipped ${Math.abs(growthPercent).toFixed(0)}% vs last period. ${dayNames[parseInt(bestDay[0])]} still drives the most sales — try re-stocking popular categories on that day.`;
  }
  return `${dayNames[parseInt(bestDay[0])]} is your top-earning day. Consider launching new listings on ${dayNames[parseInt(bestDay[0])]} evenings to maximise reach.`;
}

// ─────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────
export default function PerformanceScreen() {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]);
  const [topSellingItems, setTopSellingItems] = useState<TopSellingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);
  const [showDateModal, setShowDateModal] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const result = await getOrdersBySeller(user.id);
      let items: OrderItem[] = [];

      if (result.success && result.data.length > 0) {
        // Only completed orders count for performance & earnings
        const completedOrders = result.data.filter(
          (o: any) => o.status === "completed",
        );

        items = completedOrders.map((o: any) => {
          const fee = o.shipping_fee || 0;
          return {
            id: o.id,
            earnings: (o.amount || 0) - fee,
            amount: o.amount || 0,
            shipping_fee: fee,
            status: o.status,
            created_at: o.created_at,
          };
        });

        // Build top selling from completed orders only
        const productMap = new Map<
          string,
          {
            id: string;
            title: string;
            totalQuantity: number;
            totalEarnings: number;
            coverImage?: string;
          }
        >();

        completedOrders.forEach((o: any) => {
          if (o.product_id && o.product) {
            // Single-product order
            const key = o.product_id;
            const existing = productMap.get(key);
            const qty = o.quantity || 1;
            const earning =
              o.sellers_earning || (o.amount || 0) - (o.shipping_fee || 0);
            if (existing) {
              existing.totalQuantity += qty;
              existing.totalEarnings += earning;
            } else {
              productMap.set(key, {
                id: o.product.id,
                title: o.product.title,
                totalQuantity: qty,
                totalEarnings: earning,
                coverImage: o.product.cover_image || undefined,
              });
            }
          } else if (o.order_items?.length) {
            // Multi-product order
            o.order_items.forEach((item: any) => {
              const key = item.product_id;
              if (!key) return;
              const existing = productMap.get(key);
              const qty = item.quantity || 1;
              const earning = item.price * qty;
              if (existing) {
                existing.totalQuantity += qty;
                existing.totalEarnings += earning;
              } else {
                productMap.set(key, {
                  id: item.product_id,
                  title: item.title || item.product_id,
                  totalQuantity: qty,
                  totalEarnings: earning,
                  coverImage: item.cover_image || undefined,
                });
              }
            });
          }
        });

        setTopSellingItems(
          Array.from(productMap.values()).sort(
            (a, b) => b.totalQuantity - a.totalQuantity,
          ),
        );
      } else {
        // Fallback: out_of_stock products are considered completed sales
        const { data: sold } = await getProductsByStoreId({
          storeId: user.id,
          status: "out_of_stock",
          limit: 200,
        });
        if (sold?.length) {
          items = sold.map((p: any) => ({
            id: p.id,
            earnings: p.price,
            amount: p.price,
            shipping_fee: 0,
            status: "completed",
            created_at: p.updated_at || p.created_at,
          }));

          setTopSellingItems(
            sold.map((p: any) => ({
              id: p.id,
              title: p.title,
              totalQuantity: 1,
              totalEarnings: p.price || 0,
              coverImage: p.cover_image || undefined,
            })),
          );
        }
      }

      setAllOrders(items);
    } catch (e) {
      console.error("Error loading performance data:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Derived data ────────────────────────────
  const filteredOrders = useMemo(() => {
    return allOrders.filter((o) => {
      const d = dayjs(o.created_at);
      return (
        (d.isAfter(dateRange.startDate, "day") ||
          d.isSame(dateRange.startDate, "day")) &&
        (d.isBefore(dateRange.endDate, "day") ||
          d.isSame(dateRange.endDate, "day"))
      );
    });
  }, [allOrders, dateRange]);

  const previousOrders = useMemo(() => {
    const diffDays = dateRange.endDate.diff(dateRange.startDate, "day") + 1;
    const prevEnd = dateRange.startDate.subtract(1, "day");
    const prevStart = prevEnd.subtract(diffDays - 1, "day");
    return allOrders.filter((o) => {
      const d = dayjs(o.created_at);
      return (
        (d.isAfter(prevStart, "day") || d.isSame(prevStart, "day")) &&
        (d.isBefore(prevEnd, "day") || d.isSame(prevEnd, "day"))
      );
    });
  }, [allOrders, dateRange]);

  const totalEarnings = useMemo(
    () => filteredOrders.reduce((s, o) => s + o.earnings, 0),
    [filteredOrders],
  );

  const prevEarnings = useMemo(
    () => previousOrders.reduce((s, o) => s + o.earnings, 0),
    [previousOrders],
  );

  const growthPercent = useMemo(() => {
    if (prevEarnings > 0)
      return ((totalEarnings - prevEarnings) / prevEarnings) * 100;
    return totalEarnings > 0 ? 100 : 0;
  }, [totalEarnings, prevEarnings]);

  const avgOrderValue = useMemo(
    () =>
      filteredOrders.length > 0 ? totalEarnings / filteredOrders.length : 0,
    [filteredOrders, totalEarnings],
  );

  // Calculate new growth metrics
  const totalItemsSold = topSellingItems.reduce(
    (sum, item) => sum + item.totalQuantity,
    0,
  );

  const chartInfo = useMemo(
    () =>
      buildChartData(filteredOrders, dateRange.startDate, dateRange.endDate),
    [filteredOrders, dateRange],
  );

  const dailyEntries = useMemo(
    () =>
      buildDailyEntries(filteredOrders, dateRange.startDate, dateRange.endDate),
    [filteredOrders, dateRange],
  );

  const insight = useMemo(
    () =>
      buildInsight(
        filteredOrders,
        dateRange.startDate,
        dateRange.endDate,
        growthPercent,
      ),
    [filteredOrders, dateRange, growthPercent],
  );

  // ── Date range label for header button ─────
  const dateLabel = useMemo(() => {
    switch (dateRange.preset) {
      case "week":
        return "Last 7 Days";
      case "month":
        return "Last 30 Days";
      case "thisMonth":
        return "This Month";
      default: {
        const diff = dateRange.endDate.diff(dateRange.startDate, "day");
        if (diff === 0) return dateRange.startDate.format("MMM D");
        return `${dateRange.startDate.format("MMM D")} – ${dateRange.endDate.format("MMM D")}`;
      }
    }
  }, [dateRange]);

  const dateFilterButton = (
    <TouchableOpacity
      onPress={() => setShowDateModal(true)}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(212,163,115,0.4)",
        backgroundColor: "rgba(212,163,115,0.08)",
      }}
    >
      <CalendarIcon width={13} height={13} color="#D4A373" />
      <Typography
        variation="label"
        style={{ fontSize: 12, fontWeight: "600", color: "#D4A373" }}
      >
        {dateLabel}
      </Typography>
    </TouchableOpacity>
  );

  return (
    <>
      <ScreenLayout
        title="Performance"
        showBackButton
        rightComponent={dateFilterButton}
        backgroundColor="#FAF7F2"
        contentBackgroundColor="#FAF7F2"
        onRefresh={loadData}
      >
        <View style={{ gap: 16, paddingTop: 16 }}>
          {/* Hero revenue card */}
          <PerformanceRevenueCard
            total={totalEarnings}
            growthPercent={growthPercent}
            chartData={chartInfo.data}
            chartLabels={chartInfo.labels}
            highlightIndex={chartInfo.highlightIndex}
          />

          {/* Metric grid: orders / avg value */}
          <PerformanceMetricGrid
            ordersCount={filteredOrders.length}
            avgOrderValue={avgOrderValue}
          />

          {/* Store growth metrics */}
          {filteredOrders.length > 0 && (
            <SellerGrowthMetrics
              totalItemsSold={totalItemsSold}
              storeGrowthTrend={growthPercent}
            />
          )}

          {/* Daily / weekly breakdown */}
          {dailyEntries.length > 0 && (
            <DailyPerformanceList entries={dailyEntries} />
          )}

          {/* Empty state — only show after data has loaded */}
          {!loading && filteredOrders.length === 0 && (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 32,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(59,47,47,0.05)",
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: "rgba(212,163,115,0.12)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <ChartBarFillIcon width={28} height={28} color="#D4A373" />
              </View>
              <Typography
                variation="h5"
                style={{ fontSize: 15, color: "#3B2F2F", textAlign: "center" }}
              >
                No data for this period
              </Typography>
              <Typography
                variation="body-sm"
                style={{
                  fontSize: 13,
                  color: "rgba(59,47,47,0.5)",
                  textAlign: "center",
                  marginTop: 6,
                }}
              >
                Adjust the date range or wait for new orders
              </Typography>
            </View>
          )}

          {/* Growth insight */}
          {!loading && <GrowthInsightBanner message={insight} />}

          {/* Top selling items — always shown, handles its own empty state */}
          {!loading && <TopSellingItems items={topSellingItems} />}
        </View>
      </ScreenLayout>

      {/* Date range modal */}
      <DateRangeModal
        visible={showDateModal}
        dateRange={dateRange}
        onApply={setDateRange}
        onClose={() => setShowDateModal(false)}
      />
    </>
  );
}
