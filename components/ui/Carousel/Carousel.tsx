import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

interface CarouselItem {
  id: string;
  [key: string]: any;
}

interface CarouselProps<T extends CarouselItem = CarouselItem> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemWidth?: number;
  itemHeight?: number;
  autoPlayInterval?: number;
  containerClassName?: string;
  containerStyle?: StyleProp<ViewStyle>;
  showDots?: boolean;
  dotsContainerClassName?: string;
  activeDotStyle?: StyleProp<ViewStyle>;
  inactiveDotStyle?: StyleProp<ViewStyle>;
  onItemChange?: (index: number) => void;
  snapToAlignment?: "start" | "center" | "end";
  decelerationRate?: number | "fast" | "normal";
}

const { width: screenWidth } = Dimensions.get("window");

/**
 * Carousel Component
 *
 * A reusable carousel component with auto-play and swipe functionality.
 * Features:
 * - Horizontal scrolling/swiping
 * - Auto-play with configurable interval (default 3 seconds)
 * - Pagination dots
 * - Customizable item renderer
 * - iOS and Android compatible
 *
 * @example
 * ```tsx
 * <Carousel
 *   data={items}
 *   renderItem={(item) => (
 *     <View className="bg-white rounded-lg">
 *       <Image source={{ uri: item.image }} className="w-full h-48" />
 *       <Text className="p-4">{item.title}</Text>
 *     </View>
 *   )}
 *   itemHeight={200}
 *   autoPlayInterval={3000}
 *   showDots
 * />
 * ```
 */
export function Carousel<T extends CarouselItem = CarouselItem>({
  data,
  renderItem,
  itemWidth = screenWidth - 32,
  itemHeight = 200,
  autoPlayInterval = 3000,
  containerClassName,
  containerStyle,
  showDots = true,
  dotsContainerClassName,
  activeDotStyle,
  inactiveDotStyle,
  onItemChange,
  snapToAlignment = "start",
  decelerationRate = "fast",
}: CarouselProps<T>) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Handle scroll event
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (itemWidth + 16));

    if (index !== currentIndex && index < data.length) {
      setCurrentIndex(index);
      onItemChange?.(index);
    }
  };

  // Auto-play carousel
  useEffect(() => {
    if (autoPlayInterval === 0 || data.length <= 1) return;

    const startAutoPlay = () => {
      autoPlayTimerRef.current = setInterval(() => {
        const nextIndex = (currentIndex + 1) % data.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }, autoPlayInterval);
    };

    startAutoPlay();

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [currentIndex, autoPlayInterval, data.length]);

  return (
    <View className={containerClassName} style={containerStyle}>
      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: itemWidth,
              height: itemHeight,
              marginRight: 16,
              justifyContent: "center",
            }}
          >
            {renderItem(item, index)}
          </View>
        )}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        snapToAlignment={snapToAlignment}
        decelerationRate={decelerationRate}
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
      />

      {/* Pagination Dots */}
      {showDots && data?.length && (
        <View
          className={
            dotsContainerClassName ||
            "flex-row justify-center items-center gap-2 mt-4"
          }
        >
          {data.map((_, index) => (
            <Pressable
              key={index}
              style={[
                {
                  borderRadius: 4,
                  backgroundColor:
                    index === currentIndex ? "#3B3030" : "#D3D3D3",
                },
                index === currentIndex
                  ? activeDotStyle || {
                      width: 32,
                      height: 10,
                    }
                  : inactiveDotStyle || {
                      width: 10,
                      height: 10,
                    },
              ]}
              onPress={() => {
                flatListRef.current?.scrollToIndex({
                  index,
                  animated: true,
                });
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default Carousel;
