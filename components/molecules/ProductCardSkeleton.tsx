import { SkeletonLoader } from "@/components/atoms/SkeletonLoader";
import React from "react";
import { View } from "react-native";

interface ProductCardSkeletonProps {
  variant?: "elevated" | "grid";
  aspectRatio?: number;
  showHandle?: boolean;
}

interface ProductCardGridSkeletonProps {
  count?: number;
  variant?: "elevated" | "grid";
  aspectRatio?: number;
  columns?: number;
  gap?: number;
  showHandle?: boolean;
}

export const ProductCardGridSkeleton: React.FC<ProductCardGridSkeletonProps> = ({
  count = 4,
  variant = "grid",
  aspectRatio = 4 / 5,
  columns = 2,
  gap = 10,
  showHandle = true,
}) => {
  const rows = Math.ceil(count / columns);
  return (
    <View>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <View
          key={rowIdx}
          style={{
            flexDirection: "row",
            gap,
            marginBottom: rowIdx < rows - 1 ? gap : 0,
          }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => {
            const itemIdx = rowIdx * columns + colIdx;
            if (itemIdx >= count) {
              return <View key={colIdx} style={{ flex: 1 }} />;
            }
            return (
              <View key={colIdx} style={{ flex: 1 }}>
                <ProductCardSkeleton
                  variant={variant}
                  aspectRatio={aspectRatio}
                  showHandle={showHandle}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
  variant = "elevated",
  aspectRatio = 4 / 5,
  showHandle = true,
}) => {
  if (variant === "grid") {
    return (
      <View style={{ flex: 1 }}>
        {/* Image — matches ProductCard's aspectRatio + rounded-2xl */}
        <View
          style={{
            aspectRatio,
            width: "100%",
            borderRadius: 16,
            backgroundColor: "#eeecec",
            overflow: "hidden",
          }}
        >
          <SkeletonLoader width="100%" height="100%" borderRadius={0} />
        </View>
        {/* Info — matches pt-2 px-0.5 + body-sm/body-xs/body line-heights */}
        <View style={{ paddingTop: 8, paddingHorizontal: 2 }}>
          <View style={{ height: 20, justifyContent: "center" }}>
            <SkeletonLoader width="78%" height={12} borderRadius={6} />
          </View>
          {showHandle && (
            <View style={{ height: 16, justifyContent: "center" }}>
              <SkeletonLoader width="48%" height={10} borderRadius={6} />
            </View>
          )}
          <View
            style={{ height: 24, marginTop: 2, justifyContent: "center" }}
          >
            <SkeletonLoader width="40%" height={14} borderRadius={6} />
          </View>
        </View>
      </View>
    );
  }

  // elevated — matches ProductCard elevated: image height 180, px-3 py-3, mb-6
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 12,
        overflow: "hidden",
      }}
    >
      <View style={{ height: 180, backgroundColor: "#eeecec" }}>
        <SkeletonLoader width="100%" height="100%" borderRadius={0} />
      </View>
      <View style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
        <View
          style={{ height: 20, justifyContent: "center", marginBottom: 6 }}
        >
          <SkeletonLoader width="72%" height={12} borderRadius={6} />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ height: 24, justifyContent: "center", flex: 1 }}>
            <SkeletonLoader width="50%" height={14} borderRadius={6} />
          </View>
          <SkeletonLoader width={32} height={32} borderRadius={16} />
        </View>
      </View>
    </View>
  );
};
