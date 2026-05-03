import { ExploreSearchBar } from "@/components/explore/ExploreSearchBar";
import StoreCard from "@/components/molecules/StoreCard";
import { StoreCardSkeleton } from "@/components/molecules/StoreCardSkeleton";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { getAllStores } from "@/lib/api-helpers";
import { filterStoresBySearch, sortStores } from "@/lib/explore-helpers";
import { Profile } from "@/lib/types/database";
import { Ionicons } from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";

const PAGE_SIZE = 15;

export function ExploreStoresTab() {
  const { user } = useAuth();
  const userId = user?.id;

  const [stores, setStores] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // set by ExploreSearchBar's onDebouncedChange
  const pageRef = useRef(0);
  const fetchingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const fetchPage = useCallback(
    async (page: number, reset = false) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      try {
        const result = await getAllStores(PAGE_SIZE, page * PAGE_SIZE);
        const fetched = userId
          ? result.data.filter((s) => s.id !== userId)
          : result.data;
        hasMoreRef.current = result.data.length === PAGE_SIZE;
        setStores((prev) => (reset ? fetched : [...prev, ...fetched]));
      } catch {
        // silently fail
      } finally {
        fetchingRef.current = false;
      }
    },
    [userId],
  );

  useEffect(() => {
    setLoading(true);
    pageRef.current = 0;
    hasMoreRef.current = true;
    fetchPage(0, true).finally(() => setLoading(false));
  }, [fetchPage]);


  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    pageRef.current = 0;
    hasMoreRef.current = true;
    await fetchPage(0, true);
    setRefreshing(false);
  }, [fetchPage]);

  const handleEndReached = useCallback(() => {
    if (loadingMore || !hasMoreRef.current || loading || fetchingRef.current)
      return;
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    setLoadingMore(true);
    fetchPage(nextPage).finally(() => setLoadingMore(false));
  }, [loadingMore, loading, fetchPage]);

  const filteredStores = useMemo(
    () => sortStores(filterStoresBySearch(stores, searchQuery), "newest"),
    [stores, searchQuery],
  );

  const renderListHeader = useCallback(
    () => <View style={{ backgroundColor: "#FAF7F2", height: 8 }} />,
    [],
  );

  const ListEmptyComponent = useMemo(() => {
    if (loading) {
      return (
        <View>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={{ paddingHorizontal: 16 }}>
              <StoreCardSkeleton />
            </View>
          ))}
        </View>
      );
    }
    return (
      <View className="py-16 items-center px-4">
        <Ionicons name="storefront-outline" size={56} color="#CCCCCC" />
        <Typography variation="h4" style={{ color: "#3B2F2F", marginTop: 12 }}>
          No stores found
        </Typography>
      </View>
    );
  }, [loading]);

  return (
    <View style={{ flex: 1 }}>
      {/* Search bar is outside FlatList so it never remounts on keystroke */}
      <View
        style={{
          backgroundColor: "#FAF7F2",
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 4,
        }}
      >
        <ExploreSearchBar
          onDebouncedChange={setSearchQuery}
          placeholder="Search stores..."
        />
      </View>
      <FlatList
        data={filteredStores}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color="#3B2F2F"
              style={{ marginVertical: 16 }}
            />
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3B2F2F"
            colors={["#3B2F2F"]}
          />
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <StoreCard store={item} />
          </View>
        )}
      />
    </View>
  );
}
