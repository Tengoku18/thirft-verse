import { BlurModal } from "@/components/ui/BlurModal";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { Typography } from "@/components/ui/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getProductImageUrl } from "@/lib/storage-helpers";
import React, { ReactNode, useEffect, useRef } from "react";
import { Animated, Image, View } from "react-native";

interface ProductSuccessModalProps {
  visible: boolean;
  product: {
    id: string;
    title: string;
    price: number;
    cover_image: string;
  } | null;
  storeUsername?: string;
  children?: ReactNode;
  /** "Add Another Product" — resets form and closes */
  onClose: () => void;
  /** "View My Products" — navigates to seller's products list */
  onViewMyProducts: () => void;
  /** "View on Marketplace" — navigates to the product page */
  onViewProduct: () => void;
}

export const ProductSuccessModal: React.FC<ProductSuccessModalProps> = ({
  visible,
  product,
  storeUsername,
  children,
  onClose,
  onViewMyProducts,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 10,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible, scaleAnim, fadeAnim]);

  const marketplaceUrl = product
    ? storeUsername
      ? `https://${storeUsername}.thriftverse.shop/product/${product.id}`
      : `https://thriftverse.shop/product/${product.id}`
    : "https://thriftverse.shop";

  const coverUri = product?.cover_image
    ? getProductImageUrl(product.cover_image)
    : null;

  return (
    <BlurModal visible={visible} onDismiss={onClose}>
      <View className="w-full">
        {/* Animated success badge — overlaps card top */}
        <View className="items-center">
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
              zIndex: 10,
              marginBottom: -38,
            }}
          >
            <View
              style={{
                width: 76,
                height: 76,
                borderRadius: 38,
                backgroundColor: "#DCFCE7",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 4,
                borderColor: "#FFFFFF",
                shadowColor: "#16A34A",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.18,
                shadowRadius: 10,
                elevation: 6,
              }}
            >
              <IconSymbol
                name="checkmark.circle.fill"
                size={52}
                color="#16A34A"
              />
            </View>
          </Animated.View>
        </View>

        {/* Card */}
        <View
          className="w-full bg-white rounded-3xl pt-14 pb-6 px-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 20,
            elevation: 8,
          }}
        >
          {/* Heading */}
          <Typography
            variation="h2"
            className="text-center mb-1.5"
            style={{ color: "#3B2F2F", fontSize: 24 }}
          >
            Product Listed!
          </Typography>

          {/* Subheading */}
          <Typography
            variation="body-sm"
            className="text-center mb-6"
            style={{ color: "rgba(59,47,47,0.55)", lineHeight: 20 }}
          >
            Your item is live on your store.{"\n"}Admin approval required to show on marketplace.
          </Typography>

          {/* Product preview */}
          {product && !children && (
            <View
              className="flex-row items-center gap-3 p-3 rounded-2xl mb-5"
              style={{ backgroundColor: "#FAF7F2" }}
            >
              {/* Thumbnail */}
              <View
                className="w-[60px] h-[60px] rounded-xl overflow-hidden flex-shrink-0"
                style={{
                  borderWidth: 1,
                  borderColor: "rgba(59,47,47,0.08)",
                }}
              >
                {coverUri ? (
                  <Image
                    source={{ uri: coverUri }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    className="w-full h-full items-center justify-center"
                    style={{ backgroundColor: "rgba(59,47,47,0.06)" }}
                  >
                    <IconSymbol
                      name="bag.fill"
                      size={26}
                      color="rgba(59,47,47,0.22)"
                    />
                  </View>
                )}
              </View>

              {/* Info */}
              <View className="flex-1" style={{ gap: 4 }}>
                <Typography
                  variation="label"
                  numberOfLines={2}
                  style={{ color: "#3B2F2F", fontSize: 14, lineHeight: 19 }}
                >
                  {product.title}
                </Typography>

                <Typography
                  variation="label"
                  style={{
                    color: "#D4A373",
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  रु {product.price.toLocaleString("en-IN")}
                </Typography>

                {/* Status pill */}
                <View
                  className="self-start px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: "#DCFCE7" }}
                >
                  <Typography
                    variation="caption"
                    style={{ color: "#15803D", fontSize: 11, fontWeight: "600" }}
                  >
                    Pending Approval
                  </Typography>
                </View>
              </View>
            </View>
          )}

          {/* Custom slot */}
          {children && (
            <View className="items-center mb-5">{children}</View>
          )}

          {/* Divider */}
          <View
            className="mb-5"
            style={{ height: 1, backgroundColor: "rgba(59,47,47,0.07)" }}
          />

          {/* Actions */}
          <View style={{ gap: 10 }}>
            <Button
              label="Add Another Product"
              variant="primary"
              size="large"
              onPress={onClose}
              fullWidth
              noShadow
            />

            <Button
              label="View My Products"
              variant="tertiary"
              size="large"
              onPress={onViewMyProducts}
              fullWidth
              noShadow
            />

            <View className="items-center pt-1">
              <Link
                label="View on your website →"
                href={marketplaceUrl}
                type="external"
                variant="secondary"
                underline={false}
                typographyVariation="body-sm"
              />
            </View>
          </View>
        </View>
      </View>
    </BlurModal>
  );
};
