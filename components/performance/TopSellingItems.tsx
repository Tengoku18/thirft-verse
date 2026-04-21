import { Typography } from "@/components/ui/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, View } from "react-native";

const SECONDARY = "#D4A373";

export interface TopSellingItem {
  id: string;
  title: string;
  totalQuantity: number;
  totalEarnings: number;
  coverImage?: string;
}

interface TopSellingItemsProps {
  items: TopSellingItem[];
  currencySymbol?: string;
  previewCount?: number;
}

const RANK_COLORS: Record<number, { bg: string; text: string }> = {
  0: { bg: "#FEF3C7", text: "#B45309" },
  1: { bg: "#F1F5F9", text: "#475569" },
  2: { bg: "#FFF7ED", text: "#C2410C" },
};

export function TopSellingItems({
  items,
  currencySymbol = "Rs. ",
  previewCount = 5,
}: TopSellingItemsProps) {
  const router = useRouter();

  const sorted = [...items].sort((a, b) => b.totalQuantity - a.totalQuantity);
  const preview = sorted.slice(0, previewCount);
  const hasMore = sorted.length > previewCount;
  const maxQty = Math.max(...sorted.map((i) => i.totalQuantity), 1);

  return (
    <View>
      {/* Section label — matches DailyPerformanceList */}
      <Typography
        variation="caption"
        style={{
          fontSize: 11,
          fontWeight: "700",
          color: "rgba(59,47,47,0.4)",
          textTransform: "uppercase",
          letterSpacing: 1.2,
          marginBottom: 10,
          paddingHorizontal: 2,
        }}
      >
        Top Selling Items
      </Typography>

      {sorted.length === 0 ? (
        /* ── Empty state ── */
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            paddingVertical: 36,
            paddingHorizontal: 24,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "rgba(59,47,47,0.05)",
            shadowColor: "#3B2F2F",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: `${SECONDARY}18`,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <IconSymbol name="cube.box" size={24} color={SECONDARY} />
          </View>
          <Typography
            variation="body"
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#3B2F2F",
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            No completed sales yet
          </Typography>
          <Typography
            variation="caption"
            style={{
              fontSize: 12,
              color: "rgba(59,47,47,0.45)",
              textAlign: "center",
              lineHeight: 18,
            }}
          >
            Products will appear here once{"\n"}an order is marked completed
          </Typography>
        </View>
      ) : (
        <>
          {/* Card */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              overflow: "hidden",
              shadowColor: "#3B2F2F",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
              borderWidth: 1,
              borderColor: "rgba(59,47,47,0.05)",
            }}
          >
            {preview.map((item, index) => {
              const rank = RANK_COLORS[index] ?? {
                bg: `${SECONDARY}18`,
                text: SECONDARY,
              };
              const barWidth = (item.totalQuantity / maxQty) * 100;
              const isTop = index === 0;

              return (
                <View key={item.id}>
                  <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 10,
                      }}
                    >
                      {/* Rank badge */}
                      <View
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 13,
                          backgroundColor: rank.bg,
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          variation="label"
                          style={{
                            fontSize: 10,
                            fontWeight: "700",
                            color: rank.text,
                          }}
                        >
                          #{index + 1}
                        </Typography>
                      </View>

                      {/* Thumbnail */}
                      {item.coverImage ? (
                        <Image
                          source={{ uri: item.coverImage }}
                          resizeMode="cover"
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: 10,
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: 10,
                            backgroundColor: `${SECONDARY}18`,
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <IconSymbol
                            name="cube.box"
                            size={18}
                            color={SECONDARY}
                            style={{ opacity: 0.7 }}
                          />
                        </View>
                      )}

                      {/* Title */}
                      <Typography
                        variation="body"
                        numberOfLines={2}
                        style={{
                          flex: 1,
                          fontSize: 14,
                          fontWeight: "600",
                          color: isTop ? "#3B2F2F" : "rgba(59,47,47,0.75)",
                        }}
                      >
                        {item.title}
                      </Typography>

                      {/* Right: order count + earnings */}
                      <View style={{ alignItems: "flex-end", flexShrink: 0 }}>
                        <Typography
                          variation="body"
                          style={{
                            fontSize: 14,
                            fontWeight: "700",
                            color: isTop ? SECONDARY : "#3B2F2F",
                          }}
                        >
                          {item.totalQuantity}{" "}
                          <Typography
                            variation="caption"
                            style={{
                              fontSize: 11,
                              fontWeight: "400",
                              color: "rgba(59,47,47,0.4)",
                            }}
                          >
                            {item.totalQuantity === 1 ? "order" : "orders"}
                          </Typography>
                        </Typography>
                        <Typography
                          variation="caption"
                          style={{
                            fontSize: 12,
                            fontWeight: "600",
                            color: "#059669",
                            marginTop: 2,
                          }}
                        >
                          {currencySymbol}
                          {item.totalEarnings.toLocaleString("en-IN")}
                        </Typography>
                      </View>
                    </View>

                    {/* Progress bar */}
                    <View
                      style={{
                        height: 4,
                        backgroundColor: "rgba(59,47,47,0.06)",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          height: "100%",
                          width: `${barWidth}%`,
                          backgroundColor: isTop ? SECONDARY : `${SECONDARY}55`,
                          borderRadius: 4,
                        }}
                      />
                    </View>
                  </View>

                  {index < preview.length - 1 && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "rgba(59,47,47,0.06)",
                        marginHorizontal: 16,
                      }}
                    />
                  )}
                </View>
              );
            })}
          </View>

          {/* View All button */}
          {hasMore && (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/performance/top-selling",
                  params: { items: JSON.stringify(sorted) },
                })
              }
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                marginTop: 8,
                paddingVertical: 13,
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "rgba(59,47,47,0.08)",
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Typography
                variation="body"
                style={{ fontSize: 14, fontWeight: "600", color: SECONDARY }}
              >
                View All {sorted.length} Items
              </Typography>
              <IconSymbol name="chevron.right" size={13} color={SECONDARY} />
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}
