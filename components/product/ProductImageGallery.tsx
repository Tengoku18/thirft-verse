import { Carousel } from "@/components/ui/Carousel";
import { getProductImageUrl } from "@/lib/storage-helpers";
import React from "react";
import { Dimensions, Image, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Props {
  images: string[];
}

export function ProductImageGallery({ images }: Props) {
  const carouselData = images.map((img, i) => ({
    id: String(i),
    uri: getProductImageUrl(img),
  }));

  return (
    <View className="pt-4">
      <Carousel
        data={carouselData}
        itemWidth={SCREEN_WIDTH * 0.85}
        itemHeight={SCREEN_WIDTH * 0.85 * 1.25}
        autoPlayInterval={0}
        showDots={images.length > 1}
        snapToAlignment="center"
        renderItem={(item) => (
          <Image
            source={{ uri: item.uri }}
            style={{ width: "100%", height: "100%", borderRadius: 16 }}
            resizeMode="cover"
          />
        )}
      />
    </View>
  );
}
