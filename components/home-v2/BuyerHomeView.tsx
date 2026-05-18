import CheckmarkSealFillIcon from "@/components/icons/CheckmarkSealFillIcon";
import { Typography } from "@/components/ui/Typography";
import { PRODUCT_CATEGORIES, ProductCategory } from "@/constants/categories";
import { getAllStores } from "@/lib/api-helpers";
import { getProfileImageUrl } from "@/lib/storage-helpers";
import { Profile } from "@/lib/types/database";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { HomeBrowseSection } from "./HomeBrowseSection";
import { HomeExploreSearchBar } from "./HomeExploreSearchBar";

const FEATURED_STORE_COUNT = 8;

export const BuyerHomeView: React.FC = () => {
  return (
    <View>
      <View style={{ marginTop: 8 }}>
        <HomeExploreSearchBar />
      </View>

      <CategoriesRow />

      <FeaturedStoresRow />

      <HomeBrowseSection />
    </View>
  );
};

// ───────────────────────────────────────── Categories ──

const CATEGORY_ICONS: Record<
  ProductCategory,
  keyof typeof Ionicons.glyphMap
> = {
  Clothing: "shirt-outline",
  Shoes: "footsteps-outline",
  Accessories: "watch-outline",
  Bags: "bag-handle-outline",
  Jewelry: "diamond-outline",
  "Home & Decor": "home-outline",
  Electronics: "phone-portrait-outline",
  Books: "book-outline",
  Other: "ellipsis-horizontal-outline",
};

const CategoriesRow: React.FC = () => {
  const router = useRouter();

  return (
    <View className="mt-5 mb-1">
      <View className="mx-5">
        <SectionHeader title="Shop by Category" />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 18,
          paddingVertical: 4,
        }}
      >
        {PRODUCT_CATEGORIES.map((category) => (
          <CategoryItem
            key={category}
            label={category}
            iconName={CATEGORY_ICONS[category]}
            onPress={() =>
              router.push(
                `/explore?category=${encodeURIComponent(category)}` as never,
              )
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

interface CategoryItemProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  label,
  iconName,
  onPress,
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={{ alignItems: "center", width: 64 }}
  >
    <View
      style={{
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "rgba(212,163,115,0.18)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name={iconName} size={24} color="#3B2F2F" />
    </View>
    <Typography
      variation="body-sm"
      numberOfLines={1}
      style={{
        color: "#3B2F2F",
        fontSize: 11,
        fontWeight: "600",
        marginTop: 8,
        textAlign: "center",
      }}
    >
      {label}
    </Typography>
  </TouchableOpacity>
);

// ───────────────────────────────────────── Featured Stores ──

const FeaturedStoresRow: React.FC = () => {
  const router = useRouter();
  const [stores, setStores] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getAllStores(FEATURED_STORE_COUNT, 0);
        if (!cancelled) setStores(result.data);
      } catch {
        // silent — section just won't render
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && stores.length === 0) return null;

  return (
    <View className="mt-5">
      <View className="mx-5">
        <SectionHeader
          title="Featured Stores"
          onViewAll={() => router.push("/explore" as never)}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 12,
          paddingVertical: 4,
        }}
      >
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <StoreCardSkeleton key={i} />
            ))
          : stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onPress={() => router.push(`/store/${store.id}` as never)}
              />
            ))}
      </ScrollView>
    </View>
  );
};

interface StoreCardProps {
  store: Profile;
  onPress: () => void;
}

const STORE_CARD_WIDTH = 132;

const StoreCard: React.FC<StoreCardProps> = ({ store, onPress }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const initial = (store.store_username || store.name || "?")
    .charAt(0)
    .toUpperCase();
  const imageUrl = store.profile_image
    ? getProfileImageUrl(store.profile_image)
    : "";
  const showImage = !!imageUrl && !imageFailed;
  const displayName = store.name || store.store_username || "Store";
  const handle = store.store_username ? `@${store.store_username}` : null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        width: STORE_CARD_WIDTH,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(59,47,47,0.05)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: "rgba(212,163,115,0.2)",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {showImage ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Typography
            variation="h3"
            style={{ color: "#3B2F2F", fontSize: 24 }}
          >
            {initial}
          </Typography>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 12,
          gap: 4,
          maxWidth: STORE_CARD_WIDTH - 24,
        }}
      >
        <Typography
          variation="body-sm"
          numberOfLines={1}
          style={{
            color: "#3B2F2F",
            fontSize: 13,
            fontWeight: "700",
            flexShrink: 1,
          }}
        >
          {displayName}
        </Typography>
        {store.is_verified && (
          <CheckmarkSealFillIcon width={12} height={12} color="#1D9BF0" />
        )}
      </View>

      {handle && (
        <Typography
          variation="body-xs"
          numberOfLines={1}
          style={{
            color: "rgba(59,47,47,0.5)",
            fontSize: 11,
            marginTop: 2,
            maxWidth: STORE_CARD_WIDTH - 24,
          }}
        >
          {handle}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

const StoreCardSkeleton: React.FC = () => (
  <View
    style={{
      width: STORE_CARD_WIDTH,
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 12,
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
        backgroundColor: "rgba(59,47,47,0.06)",
      }}
    />
    <View
      style={{
        marginTop: 14,
        width: 80,
        height: 10,
        borderRadius: 4,
        backgroundColor: "rgba(59,47,47,0.06)",
      }}
    />
    <View
      style={{
        marginTop: 8,
        width: 50,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(59,47,47,0.04)",
      }}
    />
  </View>
);

// ───────────────────────────────────────── Shared ──

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onViewAll }) => (
  <View className="flex-row items-center justify-between mb-3">
    <Typography variation="h4" style={{ fontSize: 17, color: "#3B2F2F" }}>
      {title}
    </Typography>
    {onViewAll && (
      <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
        <Typography
          variation="body-sm"
          style={{ color: "#D4A373", fontSize: 14, fontWeight: "600" }}
        >
          View All
        </Typography>
      </TouchableOpacity>
    )}
  </View>
);
